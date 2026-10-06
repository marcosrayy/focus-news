"use client";

import { createContext, Suspense, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { categoryContent, getCategoryNewsQuery, type CategoryKey } from "@/config/category-news";
import { useNews } from "@/hooks/useNews";
import type { NewsArticle } from "@/types/news";
import type { ReactNode } from "react";

const FEATURED_COUNT = 4;
const INITIAL_LIST_COUNT = 12;
export const CATEGORY_FEATURED_COUNT = FEATURED_COUNT;
export const CATEGORY_INITIAL_LIST_COUNT = INITIAL_LIST_COUNT;

interface CategoryNewsFeedValue {
  articles: NewsArticle[];
  isLoading: boolean;
  isError: boolean;
  isValidating: boolean;
  lastSyncRelative: string;
  hasMore: boolean;
  loadMore: () => void;
}

const CategoryNewsFeedContext = createContext<CategoryNewsFeedValue | null>(null);

export function CategoryNewsFeed({
  category,
  children,
}: {
  category: CategoryKey;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <CategoryNewsFeedContent category={category}>{children}</CategoryNewsFeedContent>
    </Suspense>
  );
}

function CategoryNewsFeedContent({
  category,
  children,
}: {
  category: CategoryKey;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "all";
  const config = getCategoryNewsQuery(category, topic);
  const feed = useNews(config, categoryContent[category].category, FEATURED_COUNT + INITIAL_LIST_COUNT, 0, undefined, true);

  return (
    <CategoryNewsFeedContext.Provider value={feed}>
      {children}
    </CategoryNewsFeedContext.Provider>
  );
}

export function useCategoryNewsFeed(): CategoryNewsFeedValue {
  const feed = useContext(CategoryNewsFeedContext);
  if (!feed) throw new Error("useCategoryNewsFeed must be used within CategoryNewsFeed");
  return feed;
}

export function getCategoryNewsSections(articles: NewsArticle[]) {
  return {
    featuredArticles: articles.slice(0, FEATURED_COUNT),
    latestArticles: articles.slice(FEATURED_COUNT, FEATURED_COUNT + INITIAL_LIST_COUNT),
    moreArticles: articles.slice(FEATURED_COUNT + INITIAL_LIST_COUNT),
  };
}
