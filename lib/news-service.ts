"use client";

import useSWR from "swr";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  source: { name: string };
  url: string;
  category?: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  isFallback: boolean;
}

export type NewsCategory = 
  | "technology" 
  | "business" 
  | "science" 
  | "general" 
  | "entertainment"
  | "health"
  | "sports";

const fetcher = async (url: string): Promise<NewsResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
};

// Calculate relative time in Portuguese
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else if (diffDays < 7) {
    return `${diffDays}d`;
  } else {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }
}

// Hook for fetching news by category with SWR caching
export function useNews(category: NewsCategory = "technology", maxArticles: number = 6) {
  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    `/api/gnews?category=${category}&max=${maxArticles}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 600000, // 10 minutes
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    articles: data?.articles ?? [],
    isFallback: data?.isFallback ?? false,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}

// Hook for technology news
export function useTechNews(max: number = 6) {
  return useNews("technology", max);
}

// Hook for business news
export function useBusinessNews(max: number = 6) {
  return useNews("business", max);
}

// Hook for science news  
export function useScienceNews(max: number = 6) {
  return useNews("science", max);
}

// Hook for general news
export function useGeneralNews(max: number = 6) {
  return useNews("general", max);
}

// Static fallback categories for article cards
export const categoryMappings: Record<string, { label: string; color: string }[]> = {
  technology: [
    { label: "IA", color: "bg-violet-600" },
    { label: "CLOUD", color: "bg-sky-600" },
    { label: "SEGURANCA", color: "bg-red-600" },
    { label: "DEV", color: "bg-emerald-600" },
  ],
  business: [
    { label: "NEGOCIOS", color: "bg-amber-600" },
    { label: "MERCADO", color: "bg-sky-600" },
    { label: "STARTUPS", color: "bg-emerald-600" },
    { label: "ECONOMIA", color: "bg-violet-600" },
  ],
  science: [
    { label: "CIENCIA", color: "bg-cyan-600" },
    { label: "INOVACAO", color: "bg-emerald-600" },
    { label: "SAUDE", color: "bg-rose-600" },
    { label: "PESQUISA", color: "bg-violet-600" },
  ],
  general: [
    { label: "DESTAQUE", color: "bg-primary" },
    { label: "BRASIL", color: "bg-emerald-600" },
    { label: "MUNDO", color: "bg-sky-600" },
    { label: "TENDENCIAS", color: "bg-amber-600" },
  ],
};

// Get a category label and color for an article based on its index
export function getCategoryStyle(category: NewsCategory, index: number) {
  const cats = categoryMappings[category] || categoryMappings.general;
  return cats[index % cats.length];
}
