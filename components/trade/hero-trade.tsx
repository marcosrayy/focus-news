"use client";

import { LineChart } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroTrade() {
  const { articles: news, isLoading } = useNews("Mercado Financeiro OR Bolsa de Valores OR Ibovespa OR Mercado Tech", "Trade", 1);
  const article = news?.[0] || {
    title: "Bolsa de Valores e o Impacto Tech",
    description: "Buscando as ultimas noticias para voce. Se demorar, o servico pode estar em manutencao.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2000",
    category: "TRADE",
    source: "FOCUS NEWS",
    url: "#",
    publishedAt: new Date().toISOString()
  };

  if (isLoading && (!news || news.length === 0)) {
    return (
      <article className="group relative overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/10] w-full bg-secondary/50 animate-pulse sm:aspect-[3/1]">
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
            <div className="h-4 w-16 bg-muted rounded mb-2"></div>
            <div className="h-10 w-3/4 bg-muted rounded mb-3"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      onClick={() => window.open(article.url, "_blank")}
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[3/1]">
        <img
          src={article.image || "/news-focus.jpg"}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2 lg:left-6 lg:top-6">
          <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase">
            <LineChart className="h-3.5 w-3.5" />
            {article.category || "MERCADOS"}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
          <span className="mb-2 hidden text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase sm:inline-block">
            {article.source}
          </span>
          <h2 className="line-clamp-3 font-heading text-lg font-bold leading-tight text-foreground sm:line-clamp-none sm:text-2xl lg:text-4xl xl:text-5xl">
            <span className="text-balance">
              {article.title}
            </span>
          </h2>
          <p className="mt-3 hidden max-w-2xl text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:block lg:text-base">
            {article.description}
          </p>
        </div>
      </div>
    </article>
  );
}
