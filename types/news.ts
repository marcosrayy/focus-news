export interface NewsArticle {
  id: string | number;
  title: string;
  description: string;
  content: string;
  image: string;
  source: string;
  author: string;
  publishedAt: string;
  url: string;
  category: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalArticles?: number;
  isFallback?: boolean;
  lastSync?: string;
  lastSyncRelative?: string;
  error?: string;
}
