"use client";

import { Terminal, Bookmark } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroDev() {
  const { articles: news, isLoading } = useNews("", "Dev", 1);
  const article = news?.[0] || {
    title: "O Futuro do Desenvolvimento Web",
    description: "Buscando as ultimas noticias para voce. Se demorar, o servico pode estar em manutencao.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
    category: "DEV",
    source: "FOCUS NEWS",
    url: "#",
    publishedAt: new Date().toISOString()
  };

  if (isLoading && (!news || news.length === 0)) {
    return (
      <article className="group relative aspect-[3/1] overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative h-full p-4 lg:p-6 animate-pulse">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-8 w-32 bg-muted rounded"></div>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-background p-4 lg:p-6">
            <div className="h-6 w-1/4 bg-muted rounded mb-4"></div>
            <div className="h-10 w-3/4 bg-muted rounded mb-3"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      className="group relative aspect-[3/1] overflow-hidden rounded-2xl border border-border bg-card cursor-pointer"
      onClick={() => window.open(article.url, "_blank")}
    >
      <div className="relative h-full p-4 lg:p-6">
        {/* Terminal Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase">
              <Terminal className="h-3.5 w-3.5" />
              {article.category || "ARTIGO EM DESTAQUE"}
            </span>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-lg border border-foreground/30 bg-background/30 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:border-emerald-400 hover:text-emerald-400"
            >
              <Bookmark className="h-3.5 w-3.5" />
              ARQUIVAR
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/60" />
            <span className="h-3 w-3 rounded-full bg-amber-500/60" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
          </div>
        </div>

        {/* Terminal Block */}
        <div className="h-full overflow-hidden rounded-xl border border-emerald-500/20 bg-background p-4 font-mono lg:p-6 transition-colors hover:border-emerald-500/50">
          <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">~/focus-news/{article.source.toLowerCase().replace(/\s/g, '')}</span>
            <span className="text-xs text-muted-foreground">main</span>
          </div>
          <div className="mb-4">
            <span className="text-xs text-emerald-400">$ </span>
            <span className="text-xs text-muted-foreground">cat destaque.md</span>
          </div>
          <span className="mb-2 inline-block text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase">
            {article.source}
          </span>
          <h2 className="font-heading text-2xl font-bold leading-tight text-foreground lg:text-3xl xl:text-4xl">
            <span className="text-balance">
              {article.title}
            </span>
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground lg:text-base line-clamp-2">
            {article.description}
          </p>
        </div>
      </div>
    </article>
  );
}
