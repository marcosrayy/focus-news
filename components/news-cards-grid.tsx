"use client";

import { Bookmark, Clock, MessageSquare } from "lucide-react";
import { NewsArticle } from "@/types/news";
import { formatRelativeTime } from "@/lib/news-service"; // Reusing existing helper or I can inline it
import { useNewsRotation } from "@/hooks/use-news-rotation";
import { NewsSectionLayout } from "@/components/news-section-layout";
import type { ReactNode } from "react";

// Helper to assign a random or fixed color per category
function getCategoryColor(category: string) {
  const colors = ["bg-primary", "bg-emerald-600", "bg-sky-600", "bg-amber-600", "bg-violet-600", "bg-teal-600"];
  const hash = Array.from(category).reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
  // If no news, we could show skeletons, but for now just render what we have
  const articlesToRender = news.length > 0 ? news : [];
  const { featuredArticles, remainingArticles } = useNewsRotation(articlesToRender);

  if (variant === "three") {
    return (
      <NewsSectionLayout
        sidebar={sidebar}
        featured={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featuredArticles.map((article) => (
            <FeaturedCard
              key={article.id}
              article={article}
              onClick={() => window.open(article.url, "_blank")}
            />
          ))}
          </div>
        }
        list={
          <div className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2.5 font-heading text-sm font-bold tracking-wider text-foreground">
            <span className="h-5 w-1 rounded-full bg-primary shadow-glow-sm" />
            MAIS NOTÍCIAS
          </h2>
          {remainingArticles.map((article) => (
            <CompactCard
              key={article.id}
              article={article}
              onClick={() => window.open(article.url, "_blank")}
            />
          ))}
          </div>
        }
      />
    );
  }

  return (
    <NewsSectionLayout
      sidebar={sidebar}
      featured={
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {featuredArticles.map((article) => (
          <FeaturedCard 
            key={article.id} 
            article={article} 
            onClick={() => window.open(article.url, "_blank")} 
          />
        ))}
        </div>
      }
      list={
        <div className="flex flex-col gap-3">
        {remainingArticles.map((article) => (
          <CompactCard 
            key={article.id} 
            article={article} 
            onClick={() => window.open(article.url, "_blank")} 
          />
        ))}
        </div>
      }
    />
  );
}

function FeaturedCard({ article, onClick }: { article: NewsArticle; onClick: () => void }) {
  const categoryColor = getCategoryColor(article.category);
  const time = formatRelativeTime(article.publishedAt);
  const comments = Math.floor(Math.random() * 500); // Mock comments as real API doesn't have it usually

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] sm:aspect-[16/10] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className={`${categoryColor} rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-primary-foreground shadow-sm`}
          >
            {article.category}
          </span>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 bg-background/40 text-foreground/60 backdrop-blur-md transition-all duration-300 hover:border-primary hover:text-primary"
        >
          <Bookmark className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-sm font-bold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary lg:text-base">
          <span className="text-balance">{article.title}</span>
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {article.description}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3">
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

function CompactCard({ article, onClick }: { article: NewsArticle; onClick: () => void }) {
  const categoryColor = getCategoryColor(article.category);
  const time = formatRelativeTime(article.publishedAt);
  const comments = Math.floor(Math.random() * 500);

  return (
    <article
      onClick={onClick}
      className="group flex cursor-pointer gap-3 rounded-xl border border-border bg-card p-2.5 shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-card-hover sm:gap-4 sm:p-3 active:scale-[0.98]"
    >
      <div className="relative h-[72px] w-[96px] flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
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
