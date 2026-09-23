export type NewsProvider = "GNews" | "FreeNewsAPI" | "NewsAPI";

export const NEWS_PROVIDER: NewsProvider = (process.env.NEWS_PROVIDER as NewsProvider) || "GNews";
export const NEWS_API_KEY: string = process.env.NEWS_API_KEY || "2094ecfb05e8d4f4b5817fa2fb1a5179";

export const providerEndpoints = {
  GNews: "https://gnews.io/api/v4",
  FreeNewsAPI: "https://freenewsapi.com/api/v1", // Example endpoint
  NewsAPI: "https://newsapi.org/v2",
};
