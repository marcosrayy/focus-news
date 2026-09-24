"use client";

import { useNews } from "@/hooks/useNews";
import { NewsCardsGrid } from "@/components/news-cards-grid";
import type { ReactNode } from "react";

export function InnovationCases({ sidebar }: { sidebar?: ReactNode }) {
  const { 
    articles: apiNews,
    lastSyncRelative
  } = useNews("", "Inovacao", 30, 1);
  
  return (
    <>
      {lastSyncRelative && (
        <div className="mb-3 flex justify-end">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider animate-pulse">
            Atualizado {lastSyncRelative}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {apiNews.length > 0 && (
          <NewsCardsGrid news={apiNews} sidebar={sidebar} />
        )}
      </div>
    </>
  );
}
