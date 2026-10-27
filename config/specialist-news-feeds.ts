// Public Portuguese feeds checked for valid RSS and recent publication dates.
// General publications still need article-level evidence for the requested category.
export const specialistNewsFeeds = {
  Dev: [
    { url: "https://blog.4linux.com.br/feed/", source: "4Linux" },
    { url: "https://www.baguete.com.br/rss", source: "Baguete" },
    { url: "https://www.mobiletime.com.br/feed/", source: "Mobile Time" },
    { url: "https://olhardigital.com.br/feed/", source: "Olhar Digital" },
  ],
  Startups: [
    { url: "https://www.baguete.com.br/rss", source: "Baguete" },
    { url: "https://www.mobiletime.com.br/feed/", source: "Mobile Time" },
    { url: "https://braziljournal.com/feed/", source: "Brazil Journal" },
    { url: "https://startupi.com.br/feed/?paged=2", source: "Startupi" },
    { url: "https://startupi.com.br/feed/?paged=3", source: "Startupi" },
  ],
} as const;

export function getSpecialistFeeds(category: string) {
  return specialistNewsFeeds[category as keyof typeof specialistNewsFeeds] || [];
}

export function getSpecialistFeedSource(url: string): string | undefined {
  return Object.values(specialistNewsFeeds).flat().find(feed => feed.url === url)?.source;
}

export function isSpecialistSourceAllowed(source: string, category: string): boolean {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedSource = normalize(source);
  return getSpecialistFeeds(category).some(feed => normalize(feed.source) === normalizedSource);
}
