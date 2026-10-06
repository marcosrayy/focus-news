"use client";

import { Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/news-service";
import type { NewsArticle } from "@/types/news";

export function CategoryMoreNews({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 flex items-center gap-2.5 font-heading text-sm font-bold tracking-wider text-foreground">
        <span className="h-5 w-1 rounded-full bg-primary shadow-glow-sm" />
        MAIS NOTÍCIAS
      </h2>
      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30 sm:gap-4"
          >
            <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                  {article.category}
                </span>
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {article.description}
                  </p>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
                <span className="truncate">{article.source}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(article.publishedAt)}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
