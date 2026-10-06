"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { NewsResponse, NewsArticle } from "../types/news";

const fetcher = async (url: string): Promise<NewsResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
};

export function useNews(
  query: string,
  category: string = "Geral",
  maxArticles: number = 6,
  offset: number = 0,
  retentionWindowDays?: number,
  includeArchive = false,
) {
  const [archiveLimit, setArchiveLimit] = useState(maxArticles);
  const requestedMax = includeArchive ? archiveLimit : maxArticles;
  const { data, error, isLoading, isValidating, mutate } = useSWR<NewsResponse>(
    `/api/news?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&max=${requestedMax}&offset=${offset}${retentionWindowDays ? `&retentionDays=${retentionWindowDays}` : ""}${includeArchive ? "&archive=true" : ""}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // Check every 60 seconds for live feeling (as requested by client verification interval)
      dedupingInterval: 15000,
    }
  );

  const [displayedArticles, setDisplayedArticles] = useState<NewsArticle[]>([]);
  const [latestArticles, setLatestArticles] = useState<NewsArticle[]>([]);
  const [hasUpdates, setHasUpdates] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const displayedIdsRef = useRef(new Set<string>());

  // Keep the rendered list in sync with each refreshed API response.
  useEffect(() => {
    if (!data?.articles) return;

    const newArticles = data.articles.filter(a => !displayedIdsRef.current.has(String(a.id)));
    displayedIdsRef.current = new Set(data.articles.map((article) => String(article.id)));

    setDisplayedArticles(data.articles);
    setLatestArticles(data.articles);

    if (newArticles.length > 0) {
      setHasUpdates(true);
      setNewCount(newArticles.length);
    } else {
      setHasUpdates(false);
      setNewCount(0);
    }
  }, [data]);

  // Apply the updates to the UI smoothly
  const triggerUpdate = () => {
    if (latestArticles.length > 0) {
      setDisplayedArticles(latestArticles);
      setHasUpdates(false);
      setNewCount(0);
    }
  };

  return {
    articles: displayedArticles,
    totalArticles: data?.totalArticles,
    hasMore: includeArchive && data?.totalArticles !== undefined
      ? offset + displayedArticles.length < data.totalArticles
      : false,
    loadMore: () => {
      if (includeArchive) setArchiveLimit((current) => current + 12);
    },
    isFallback: displayedArticles.length === 0 && !isLoading,
    isLoading: isLoading && displayedArticles.length === 0,
    isError: !!error,
    isValidating,
    refresh: async () => {
      const res = await mutate();
      if (res?.articles) {
        setDisplayedArticles(res.articles);
        setLatestArticles(res.articles);
        setHasUpdates(false);
        setNewCount(0);
      }
    },
    hasUpdates,
    newCount,
    triggerUpdate,
    lastSync: data?.lastSync,
    lastSyncRelative: data?.lastSyncRelative || "há instantes"
  };
}
