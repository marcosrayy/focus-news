"use client";

import { LoaderCircle } from "lucide-react";

export function LoadMoreNews({
  onLoadMore,
  isLoading,
  hasMore,
}: {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}) {
  if (!hasMore) return null;

  return (
    <div className="mt-4 flex justify-center">
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:cursor-wait disabled:opacity-60"
      >
        {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
        Carregar mais notícias
      </button>
    </div>
  );
}
