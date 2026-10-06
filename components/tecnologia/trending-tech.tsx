"use client";

import { Suspense } from "react";

import { Clock, MessageSquare, Brain, Cloud, Shield, Blocks } from "lucide-react";

import { formatRelativeTime } from "@/lib/news-service";
import { useNewsRotation } from "@/hooks/use-news-rotation";
import { LoadMoreNews } from "@/components/load-more-news";
import {
  FeaturedNewsCarousel,
  NewsSectionLayout,
} from "@/components/news-section-layout";
import {
  getCategoryNewsSections,
  useCategoryNewsFeed,
} from "@/components/category-news-feed";
import { CategoryMoreNews } from "@/components/category-more-news";

import type { ReactNode } from "react";

function getTechIcon(category: string) {
  const c = category.toLowerCase();

  if (c.includes("ia") || c.includes("ai")) {
    return <Brain className="h-3 w-3" />;
  }

  if (c.includes("cloud")) {
    return <Cloud className="h-3 w-3" />;
  }

  if (c.includes("seguranca") || c.includes("cyber")) {
    return <Shield className="h-3 w-3" />;
  }

  return <Blocks className="h-3 w-3" />;
}

function getTechCategoryColor(category: string) {
  const c = category.toLowerCase();

  if (c.includes("ia") || c.includes("ai")) {
    return "bg-violet-600";
  }

  if (c.includes("cloud")) {
    return "bg-sky-600";
  }

  if (c.includes("seguranca") || c.includes("cyber")) {
    return "bg-red-600";
  }

  return "bg-amber-600";
}

export function TrendingTech({ sidebar }: { sidebar?: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TrendingTechContent sidebar={sidebar} />
    </Suspense>
  );
}

function TrendingTechContent({ sidebar }: { sidebar?: ReactNode }) {
  const feed = useCategoryNewsFeed();

  const {
    latestArticles: news,
    moreArticles,
  } = getCategoryNewsSections(feed.articles);

  const {
    hasMore,
    loadMore,
    isValidating,
    lastSyncRelative,
  } = feed;

  const articlesToRender = news.length > 0 ? news : [];

  const { featuredArticles, remainingArticles } =
    useNewsRotation(articlesToRender);

  return (
    <>
      {lastSyncRelative && (
        <div className="mb-3 flex justify-end">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground animate-pulse">
            Atualizado {lastSyncRelative}
          </span>
        </div>
      )}

      <NewsSectionLayout
        sidebar={sidebar}
        featured={
          <FeaturedNewsCarousel label="Notícias de tecnologia em destaque">
            {featuredArticles.map((article) => (
              <FeaturedTechCard
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
                <CompactTechCard
                  key={article.id}
                  article={article}
                  onClick={() => window.open(article.url, "_blank")}
                />
              ))}
            </div>
          ) : null
        }
      />

      <CategoryMoreNews articles={moreArticles} />

      <LoadMoreNews
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isValidating}
      />
    </>
  );
}

function FeaturedTechCard({
  article,
  onClick,
}: {
  article: any;
  onClick: () => void;
}) {
  const time = formatRelativeTime(article.publishedAt);
  const comments = Math.floor(Math.random() * 200);
  const icon = getTechIcon(article.category || "tech");
  const color = getTechCategoryColor(article.category || "tech");

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/30 hover:shadow-lg hover:shadow-sky-400/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className={`${color} flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider text-white`}
          >
            {icon}
            {article.category || "TECH"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-sky-400 lg:text-base">
          <span className="text-balance">{article.title}</span>
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {article.description}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {article.author}
          </span>

          <div className="flex items-center gap-3">
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

function CompactTechCard({
  article,
  onClick,
}: {
  article: any;
  onClick: () => void;
}) {
  const time = formatRelativeTime(article.publishedAt);
  const comments = Math.floor(Math.random() * 200);
  const icon = getTechIcon(article.category || "tech");
  const color = getTechCategoryColor(article.category || "tech");

  return (
    <article
      onClick={onClick}
      className="group flex cursor-pointer gap-4 rounded-xl border border-border bg-card p-3 transition-all duration-300 hover:border-sky-400/30 hover:shadow-md hover:shadow-sky-400/5"
    >
      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span
          className={`${color} absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white`}
        >
          {icon}
          {article.category || "TECH"}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-sky-400">
            {article.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {article.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">
            {article.author}
          </span>

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
