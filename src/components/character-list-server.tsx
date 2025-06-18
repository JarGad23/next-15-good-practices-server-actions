"use client";

import { useTransition, useState, useEffect } from "react";
import { getCharacters, prefetchCharacters } from "@/lib/actions";
import Image from "next/image";
import { Character } from "@/types/character";

interface CharacterListServerProps {
  initialCharacters: Character[];
  status: string;
  page: number;
  onLoadTime: (time: number) => void;
  incrementRequestCount: () => void;
  onCacheHit: () => void;
}

export const CharacterListServer = ({
  initialCharacters,
  status,
  page,
  onLoadTime,
  incrementRequestCount,
  onCacheHit,
}: CharacterListServerProps) => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [isPending, startTransition] = useTransition();
  const [lastCacheStatus, setLastCacheStatus] = useState<string>("");

  useEffect(() => {
    startTransition(async () => {
      try {
        const start = performance.now();

        const result = await getCharacters(status, page);

        const end = performance.now();
        const requestTime = end - start;

        if (result.fromCache) {
          onCacheHit();
          setLastCacheStatus(`⚡ Cache HIT (${result.cacheKey})`);
          console.log(`⚡ Cache hit - load time: ${requestTime.toFixed(0)}ms`);
        } else {
          incrementRequestCount();
          setLastCacheStatus(`🌐 API Call (${result.cacheKey})`);
          console.log(`🌐 API call - load time: ${requestTime.toFixed(0)}ms`);
        }

        onLoadTime(requestTime);

        if (page === 1) {
          setCharacters(result.data.results);
        } else {
          setCharacters((prev) => [...prev, ...result.data.results]);
        }

        if (result.data.info.next) {
          prefetchCharacters(status, page + 1);
        }
      } catch (error) {
        console.error("Failed to load characters:", error);
        setLastCacheStatus("❌ Error");
      }
    });
  }, [status, page]);

  return (
    <>
      {lastCacheStatus && (
        <div className="mb-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
          Last request: {lastCacheStatus}
        </div>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {characters.map((character) => (
          <li
            key={character.id}
            className={`p-4 border rounded shadow transition-opacity ${
              isPending ? "opacity-70" : "opacity-100"
            }`}
          >
            <Image
              src={character.image}
              alt={character.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover mb-2 rounded"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyBWjWtklcBWVmIcdm3Hmw2hQBtHJz7MX6hjRoHJEQHrJL2eYTQhWjj/9k="
            />
            <h2 className="text-lg font-semibold">{character.name}</h2>
            <p className="text-gray-600">
              {character.status} - {character.species}
            </p>
          </li>
        ))}
      </ul>

      {isPending && (
        <div className="flex justify-center mt-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded bg-gray-300 h-10 w-20"></div>
            <div className="rounded bg-gray-300 h-10 w-32"></div>
          </div>
        </div>
      )}
    </>
  );
};
