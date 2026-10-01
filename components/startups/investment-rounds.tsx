"use client";

import { useSearchParams } from "next/navigation";
import { useNews } from "@/hooks/useNews";
import { NewsCardsGrid } from "@/components/news-cards-grid";
import type { ReactNode } from "react";

export function InvestmentRounds({ sidebar }: { sidebar?: ReactNode }) {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "all";

  const topicQueries: Record<string, string> = {
    fintech: 'Fintech OR "banco digital" OR "pagamentos" OR "startup fintech"',
    ai: 'IA OR inteligência artificial OR agentes OR deep tech',
    logistics: 'logistica OR marketplace OR delivery OR mobility',
    edtech: 'EdTech OR educação digital OR educação startup',
    healthtech: 'HealthTech OR saúde digital OR biotech OR medicina',
    proptech: 'PropTech OR imobiliário digital OR real estate tech',
    logtech: 'LogTech OR logística digital OR supply chain',
    agtech: 'AgTech OR agricultura digital OR agritech',
    cleantech: 'CleanTech OR sustentabilidade OR energia limpa',
  };

  const activeQuery = topicQueries[topic] || '"Startup" OR "Venture Capital" OR "Fintech" OR "Rodada de investimento"';

  const { 
    articles: apiNews,
    lastSyncRelative
  } = useNews(activeQuery, "Startups", 12, 1);
  
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
