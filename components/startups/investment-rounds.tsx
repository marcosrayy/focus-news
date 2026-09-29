"use client";

import { useNews } from "@/hooks/useNews";
import { NewsCardsGrid } from "@/components/news-cards-grid";
import type { ReactNode } from "react";

export function InvestmentRounds({ sidebar }: { sidebar?: ReactNode }) {
  const { 
    articles: apiNews,
    lastSyncRelative
  } = useNews('"Startup" OR "Venture Capital" OR "Fintech" OR "Rodada de investimento"', "Startups", 12, 1);
  
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
          <div className="mt-2">
            <h2 className="text-xl font-bold font-heading text-foreground mb-4">Últimas Notícias do Setor</h2>
            <NewsCardsGrid news={apiNews} sidebar={sidebar} />
          </div>
        )}
      </div>
    </>
  );
}
