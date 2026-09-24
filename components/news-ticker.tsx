"use client";

import { NewsArticle } from "@/types/news";

export function NewsTicker({ news = [] }: { news?: NewsArticle[] }) {
  // Use mock fallback just in case, but prioritize the news array
  const newsItems = news.length > 0 
    ? news.map(article => article.title)
    : [
        "Carregando ultimas atualizacoes...",
        "Aguarde enquanto sincronizamos os dados."
      ];

  return (
    <div className="flex items-center gap-4 overflow-hidden border-b border-border bg-background/50 px-4 py-2">
      <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-primary-foreground shadow-glow-sm">
        AGORA
      </span>
      <div className="relative overflow-hidden">
        <div className="flex animate-news whitespace-nowrap">
          {[...newsItems, ...newsItems].map((item, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-6 px-4 text-xs text-muted-foreground lg:text-sm"
            >
              <span className="mr-6 text-border">{"•"}</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
