"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { NewsResponse, NewsArticle } from "../types/news";

const fetcher = async (url: string): Promise<NewsResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
};

export function useNews(query: string, category: string = "Geral", maxArticles: number = 6, offset: number = 0) {
  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    `/api/news?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&max=${maxArticles}&offset=${offset}`,
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

  // Sync displayed articles on initial load
  useEffect(() => {
    if (data?.articles && displayedArticles.length === 0) {
      setDisplayedArticles(data.articles);
      setLatestArticles(data.articles);
    }
  }, [data, displayedArticles.length]);

  // Check for updates when data changes in background
  useEffect(() => {
    if (!data?.articles || displayedArticles.length === 0) return;

    // Check if there are new articles (by checking if their URLs/IDs are not in our displayed list)
    const displayedIds = new Set(displayedArticles.map(a => a.id));
    const newArticles = data.articles.filter(a => !displayedIds.has(a.id));

    if (newArticles.length > 0) {
      setHasUpdates(true);
      setNewCount(newArticles.length);
      setLatestArticles(data.articles);
    } else {
      // If the background sync returned same or fewer items (e.g. deletion), update silently if no brand new articles
      setLatestArticles(data.articles);
    }
  }, [data, displayedArticles]);

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
    isFallback: displayedArticles.length === 0 && !isLoading,
    isLoading: isLoading && displayedArticles.length === 0,
    isError: !!error,
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

