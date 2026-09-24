"use client";

import { useEffect, useState } from "react";

export const NEWS_ROTATION_INTERVAL = 5 * 60 * 1000;

export function useNewsRotation<T>(
  articles: T[],
  featuredCount = 3,
  interval = NEWS_ROTATION_INTERVAL,
) {
  const [rotationIndex, setRotationIndex] = useState(0);
  const articleCount = articles.length;

  useEffect(() => {
    setRotationIndex(0);
  }, [articleCount]);

  useEffect(() => {
    if (articleCount <= featuredCount) return;

    const timer = window.setInterval(() => {
      setRotationIndex((current) => (current + 1) % articleCount);
    }, interval);

    return () => window.clearInterval(timer);
  }, [articleCount, featuredCount, interval]);

  const orderedArticles = articleCount
    ? articles.map((_, index) => articles[(index + rotationIndex) % articleCount])
    : [];

  return {
    featuredArticles: orderedArticles.slice(0, featuredCount),
    remainingArticles: orderedArticles.slice(featuredCount),
    isRotating: articleCount > featuredCount,
  };
}