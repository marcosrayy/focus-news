"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useNews } from "@/hooks/useNews";
import { NewsCardsGrid } from "@/components/news-cards-grid";
import type { ReactNode } from "react";

export function InnovationCases({ sidebar }: { sidebar?: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <InnovationCasesContent sidebar={sidebar} />
    </Suspense>
  );
}

function InnovationCasesContent({ sidebar }: { sidebar?: ReactNode }) {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "all";

  const topicQueries: Record<string, string> = {
    cleantech: "CleanTech OR energia limpa OR sustentabilidade OR clima",
    biotech: "biotech OR biotecnologia OR pesquisa OR medicina",
    agtech: "AgTech OR agricultura digital OR agronegócio OR cultivo",
    edtech: "EdTech OR educação digital OR ensino inovador",
    "cooperativism": "cooperativismo OR economia colaborativa OR plataforma cooperativa",
    "impact-as-service": "impact-as-a-service OR impacto social OR inovação social",
    "open-hardware": "open hardware OR hardware aberto OR tecnologia aberta",
    urbanismo: "urbanismo OR cidades inteligentes OR infraestrutura",
    sustentabilidade: "sustentabilidade OR bioeconomia OR meio ambiente",
    educacao: "educação digital OR ensino inovador OR IA na educação",
  };

  const activeQuery = topicQueries[topic] || "";

  const { 
    articles: apiNews,
    lastSyncRelative
  } = useNews(activeQuery, "Inovacao", 30, 1);
  
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
