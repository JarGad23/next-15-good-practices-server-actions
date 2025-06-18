"use client";

import { useEffect, useState } from "react";
import { CharacterListServer } from "./character-list-server";
import { DevToolbar } from "./dev-toolbar";
import { Character } from "@/types/character";
import { StatusSelect } from "./status-selector";

interface ClientWrapperProps {
  initialCharacters: Character[];
  initialStatus: string;
  initialPage: number;
}

export const ClientWrapper = ({
  initialCharacters,
  initialStatus,
  initialPage,
}: ClientWrapperProps) => {
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(initialPage);
  const [loadTime, setLoadTime] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [cacheHitCount, setCacheHitCount] = useState(0);

  useEffect(() => {
    setStatus(initialStatus);
    setPage(initialPage);
  }, [initialStatus, initialPage]);

  const handleStatusChange = (newStatus: string) => {
    setPage(1);
    setStatus(newStatus);
    window.history.pushState({}, "", `?status=${newStatus}&page=1`);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <>
      <DevToolbar
        loadTime={loadTime}
        requestCount={requestCount}
        cacheHitCount={cacheHitCount}
        renderType="SSR + Client Hydration"
        cacheStatus="Enabled (5min TTL)"
      />

      <StatusSelect status={status} onChange={handleStatusChange} />

      <CharacterListServer
        initialCharacters={page === 1 ? initialCharacters : []}
        status={status}
        page={page}
        incrementRequestCount={() => setRequestCount((prev) => prev + 1)}
        onCacheHit={() => setCacheHitCount((prev) => prev + 1)}
        onLoadTime={(time) => setLoadTime(time)}
      />

      <button
        onClick={handleLoadMore}
        className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Load More
      </button>
    </>
  );
};
