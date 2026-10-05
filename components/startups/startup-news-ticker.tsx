"use client";

import { NewsTicker } from "@/components/news-ticker";
import { useNews } from "@/hooks/useNews";

export function StartupNewsTicker() {
  const { articles } = useNews('"Startup" OR "Venture Capital" OR "Aporte"', "Startups", 10);

  return <NewsTicker news={articles} />;
}