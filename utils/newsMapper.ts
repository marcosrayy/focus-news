import { NewsArticle } from "../types/news";
import { NewsProvider } from "../config/newsConfig";

export function mapNewsResponse(data: any, provider: NewsProvider, category: string): NewsArticle[] {
  if (!data || !data.articles) return [];

  return data.articles.map((article: any, index: number) => {
    let mapped: Partial<NewsArticle> = {
      id: article.url || String(index),
      category: category,
      title: article.title || "Sem título",
      description: article.description || "Sem descrição",
      content: article.content || "",
      publishedAt: article.publishedAt || new Date().toISOString(),
      url: article.url || "#",
    };

    if (provider === "GNews") {
      mapped.image = article.image || "/placeholder.svg";
      mapped.source = article.source?.name || "GNews";
      mapped.author = article.author || mapped.source;
    } else if (provider === "NewsAPI") {
      mapped.image = article.urlToImage || "/placeholder.svg";
      mapped.source = article.source?.name || "NewsAPI";
      mapped.author = article.author || mapped.source;
    } else {
      // FreeNewsAPI or generic fallback
      mapped.image = article.image || article.urlToImage || article.picture || "/placeholder.svg";
      mapped.source = article.source?.name || article.clean_url || "News";
      mapped.author = article.author || mapped.source;
    }

    return mapped as NewsArticle;
  });
}
