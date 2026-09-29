"use client";

import { Bookmark, Cpu } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "@/components/ui/skeleton";

import { NewsArticle } from "@/types/news";

export function HeroTech({
  article: propArticle,
  isLoading: propIsLoading,
}: { article?: NewsArticle; isLoading?: boolean } = {}) {
  const { articles: news, isLoading: hookIsLoading } = useNews(
    "Hardware OR Processador OR Inovacao OR Noticias Tech",
    "Tecnologia",
    1,
  );
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;

  const article = propArticle ||
    news?.[0] || {
      title: "Novos Chips Prometem Dobrar a Velocidade",
      description:
        "Buscando as ultimas noticias para voce. Se demorar, o servico pode estar em manutencao.",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
      category: "HARDWARE",
      source: "FOCUS NEWS",
      url: "#",
      publishedAt: new Date().toISOString(),
    };

  if (isLoading && !propArticle && (!news || news.length === 0)) {
    return (
      <article className="group relative overflow-hidden rounded-2xl h-full">
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
      className="group relative h-full overflow-hidden rounded-2xl border border-border/60 shadow-card transition-shadow duration-500 hover:shadow-card-hover cursor-pointer"
      onClick={() => window.open(article.url, "_blank")}
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[3/1]">
        <img
          src={article.image || "/news-focus.jpg"}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2 lg:left-6 lg:top-6">
          <span className="flex items-center gap-1.5 rounded-full bg-sky-500 px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-[0_0_20px_-4px_rgba(14,165,233,0.5)]">
            <Cpu className="h-3.5 w-3.5" />
            {article.category || "LANCAMENTO"}
          </span>
          <button
            onClick={(e) => e.stopPropagation()}
            className="hidden items-center gap-1.5 rounded-full border border-foreground/30 bg-background/30 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:border-sky-400 hover:text-sky-400 sm:flex"
          >
            <Bookmark className="h-3.5 w-3.5" />
            ARQUIVAR
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-7">
          <span className="mb-2 hidden items-center gap-2 text-xs font-bold tracking-[0.2em] text-sky-400 uppercase sm:inline-flex">
            <span className="h-px w-5 bg-sky-400" />
            {article.source}
          </span>
          <h2 className="line-clamp-3 font-heading text-lg font-bold leading-tight tracking-tight text-foreground sm:line-clamp-none sm:text-2xl sm:leading-[1.1] lg:text-4xl xl:text-5xl">
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
