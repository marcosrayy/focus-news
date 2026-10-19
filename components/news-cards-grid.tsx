"use client";

import { Clock, MessageSquare } from "lucide-react";
import { NewsArticle } from "@/types/news";
import { formatRelativeTime } from "@/lib/news-service";
import { useNewsRotation } from "@/hooks/use-news-rotation";
import { FeaturedNewsCarousel, NewsSectionLayout } from "@/components/news-section-layout";
import { useMemo, type ReactNode } from "react";
import { getGeneratedCover } from "@/lib/utils";

type NewsArticleWithDisplayImage = NewsArticle & {
  displayImage: string;
};




// Helper to assign a random or fixed color per category
function getCategoryColor(category: string | number) {
  const colors = [
    "bg-primary",
    "bg-emerald-600",
    "bg-sky-600",
    "bg-amber-600",
    "bg-violet-600",
    "bg-teal-600",
  ];

  const hash = Array.from(String(category)).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  return colors[hash % colors.length];
}

export function NewsCardsGrid({
  news = [],
  variant = "default",
  sidebar,
}: {
  news?: NewsArticle[];
  variant?: "default" | "three";
  sidebar?: ReactNode;
}) {
  // As capas já chegam únicas de assignCovers() (feito uma vez no feed da categoria).
  const articlesToRender = useMemo<NewsArticleWithDisplayImage[]>(
    () =>
      news.map((article) => ({
        ...article,
        displayImage:
          article.image?.trim() ||
          getGeneratedCover(String(article.id), String(article.category ?? "")),
      })),
    [news]
  );
  const { featuredArticles, remainingArticles } = useNewsRotation(articlesToRender);

  if (variant === "three") {
    return (
      <NewsSectionLayout
        sidebar={sidebar}
        featured={
          <FeaturedNewsCarousel label="Últimas notícias em destaque">
            {featuredArticles.map((article) => (
                <FeaturedCard
                  key={article.id}
                  article={article}
                  onClick={() => window.open(article.url, "_blank")}
                />
            ))}
          </FeaturedNewsCarousel>
        }
        list={
          remainingArticles.length > 0 ? (
            <div className="flex flex-col gap-3">
              {remainingArticles.map((article) => (
                <CompactCard
                  key={article.id}
                  article={article}
                  onClick={() => window.open(article.url, "_blank")}
                />
              ))}
            </div>
          ) : null
        }
      />
    );
  }

  return (
    <NewsSectionLayout
      sidebar={sidebar}
      featured={
        <FeaturedNewsCarousel>
          {featuredArticles.map((article) => (
            <FeaturedCard
              key={article.id}
              article={article}
              onClick={() => window.open(article.url, "_blank")}
            />
          ))}
        </FeaturedNewsCarousel>
      }
      list={
        remainingArticles.length > 0 ? (
          <div className="flex flex-col gap-3">
            {remainingArticles.map((article) => (
              <CompactCard
                key={article.id}
                article={article}
                onClick={() => window.open(article.url, "_blank")}
              />
            ))}
          </div>
        ) : null
      }
    />
  );
}

function FeaturedCard({ article, onClick }: { article: NewsArticleWithDisplayImage; onClick: () => void }) {
  const categoryColor = getCategoryColor(article.category);
  const time = formatRelativeTime(article.publishedAt);
  const comments = Math.floor(Math.random() * 500); // Mock comments as real API doesn't have it usually

  return (
    <article
      onClick={onClick}
      className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {article.displayImage ? (
          <img
            src={article.displayImage}
            alt={article.title}
            loading="lazy"
            onError={(event) => {
              const img = event.currentTarget;
              if (img.dataset.fallbackApplied === "true") {
                img.style.display = "none";
                return;
              }
              img.dataset.fallbackApplied = "true";
              img.src = getGeneratedCover(String(article.id), String(article.category ?? ""));
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            Imagem indisponível
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className={`${categoryColor} rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-primary-foreground shadow-sm`}
          >
            {article.category}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-3 min-h-[3.6em] font-heading text-sm font-bold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary lg:text-base">
          <span className="text-balance">{article.title}</span>
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {article.description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-3">
          <span className="truncate text-xs font-medium text-muted-foreground">{article.author}</span>
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[10px]">{time}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span className="text-[10px]">{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactCard({ article, onClick }: { article: NewsArticleWithDisplayImage; onClick: () => void }) {
  const categoryColor = getCategoryColor(article.category);
  const time = formatRelativeTime(article.publishedAt);
  const comments = Math.floor(Math.random() * 500);

  return (
    <article
      onClick={onClick}
      className="group flex cursor-pointer gap-3 rounded-xl border border-border bg-card p-2.5 shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-card-hover sm:gap-4 sm:p-3 active:scale-[0.98]"
    >
      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-28 sm:w-40 lg:h-32 lg:w-44">
        {article.displayImage ? (
          <img
            src={article.displayImage}
            alt={article.title}
            loading="lazy"
            onError={(event) => {
              const img = event.currentTarget;
              if (img.dataset.fallbackApplied === "true") {
                img.style.display = "none";
                return;
              }
              img.dataset.fallbackApplied = "true";
              img.src = getGeneratedCover(String(article.id), String(article.category ?? ""));
            }}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-muted-foreground">
            Imagem indisponível
          </div>
        )}
        <span
          className={`${categoryColor} absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-primary-foreground`}
        >
          {article.category}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {article.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="truncate text-[10px] font-medium text-muted-foreground">{article.author}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            <span className="text-[10px]">{time}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-2.5 w-2.5" />
            <span className="text-[10px]">{comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
