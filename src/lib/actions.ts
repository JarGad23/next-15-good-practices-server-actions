"use server";

import { Character } from "@/types/character";
import { unstable_cache } from "next/cache";

interface ApiResponse {
  results: Character[];
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
}

interface CacheResult {
  data: ApiResponse;
  fromCache: boolean;
  cacheKey: string;
}

const cacheTracker = new Map<string, number>();

const getCachedCharacters = unstable_cache(
  async (status: string, page: number): Promise<ApiResponse> => {
    console.log(`🌐 Server: Making API call - status=${status}, page=${page}`);

    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?status=${status}&page=${page}`,
      {
        next: {
          revalidate: 300,
          tags: [`characters-${status}`],
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }

    return response.json();
  },
  ["characters"],
  {
    revalidate: 300,
    tags: ["characters"],
  }
);

export async function getCharacters(
  status: string,
  page: number = 1
): Promise<CacheResult> {
  try {
    const cacheKey = `characters-${status}-${page}`;
    const previousCallTime = cacheTracker.get(cacheKey);
    const now = Date.now();

    const isLikelyFromCache =
      previousCallTime && now - previousCallTime < 300000;

    const data = await getCachedCharacters(status, page);

    if (!isLikelyFromCache) {
      cacheTracker.set(cacheKey, now);
      console.log(`💾 Cache MISS - storing: ${cacheKey}`);
    } else {
      console.log(`⚡ Cache HIT - using cached: ${cacheKey}`);
    }

    return {
      data,
      fromCache: Boolean(isLikelyFromCache),
      cacheKey,
    };
  } catch (error) {
    console.error("Server action error:", error);
    throw new Error("Failed to load characters");
  }
}

export async function prefetchCharacters(status: string, page: number) {
  try {
    await getCachedCharacters(status, page);
  } catch (error) {
    console.warn("Prefetch failed:", error);
  }
}
