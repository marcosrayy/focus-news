import { NextResponse } from "next/server";

import { balanceArticlesBySource, fetchNewsBackend } from "../../../services/newsService";
import { Storage } from "../../../utils/storage";
import { RefreshEngine } from "../../../services/refreshEngine";

export const dynamic = "force-dynamic";

function getRelativeTimeServer(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `há ${diffMinutes} min`;
  } else if (diffHours < 24) {
    return `há ${diffHours}h`;
  } else if (diffDays < 7) {
    return `há ${diffDays}d`;
  } else {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }
}

// Simple deterministic shuffle based on current hour
function rotateArticles(articles: any[], category: string): any[] {
  if (articles.length <= 1) return articles;

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const timeBucket = Math.floor(currentMinute / 10); // 10-minute buckets for variation

  // Separate into Featured (first 2) and Compact (rest)
  const featured = articles.slice(0, 2);
  const compact = articles.slice(2);

  // Rotate featured articles if the hour is odd
  if (featured.length === 2 && (currentHour % 2 === 1)) {
    featured.reverse();
  }

  // Rotate compact articles using a rotation index based on time bucket
  if (compact.length > 1) {
    const rotationIndex = (currentHour + timeBucket) % compact.length;
    const rotatedCompact = [
      ...compact.slice(rotationIndex),
      ...compact.slice(0, rotationIndex)
    ];
    return [...featured, ...rotatedCompact];
  }

  return [...featured, ...compact];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "Geral";
  const max = parseInt(searchParams.get("max") || "6", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  try {
    // 1. Fetch current status to check for lazy sync trigger
    const status = Storage.readStatus();
    const lastSyncTime = new Date(status.lastSync).getTime();
    const timeSinceLastSync = Date.now() - lastSyncTime;

    // Trigger background sync asynchronously if cache is older than 15 minutes
    if (timeSinceLastSync > 15 * 60 * 1000) {
      console.log(`[API/News] Lazy triggering sync. Stale time: ${Math.round(timeSinceLastSync / 1000)}s`);
      RefreshEngine.runSync().catch(err => {
        console.error('[API/News] Lazy trigger background sync failed:', err);
      });
    }

    // 2. Fetch persisted articles
    const allArticles = Storage.readArticles();

    // 3. Filter by category
    // virtual category mapping
    let targetCategory = category;
    if (category === "Geral" || category === "Destaques") {
      targetCategory = "Tecnologia";
    } else if (category === "Trade") {
      targetCategory = "Economia";
    } else if (category === "Business") {
      targetCategory = "Business";
    } else if (category === "Inovacao") {
      targetCategory = "Inovacao";
    } else if (category === "Dev") {
      targetCategory = "Dev";
    } else if (category === "IA") {
      targetCategory = "IA";
    } else if (category === "Startups") {
      targetCategory = "Startups";
    } else if (category === "Home") {
      targetCategory = "Home";
    }

    let filtered = allArticles.filter(art => 
      art.category === targetCategory || 
      (targetCategory === "Home" && (art.category === "Startups" || art.category === "Tecnologia" || art.category === "Inovacao")) ||
      (targetCategory === "Startups" && art.source.toLowerCase().includes("exame")) ||
      (targetCategory === "Tecnologia" && art.source.toLowerCase().includes("cnn")) ||
      (targetCategory === "Business" && art.source.toLowerCase().includes("forbes")) ||
      (targetCategory === "Business" && art.category === "Startups" && art.source.toLowerCase().includes("startupi"))
    );

    // Strictly enforce sources for Inovacao to filter out old cached data
    if (targetCategory === "Inovacao") {
      filtered = filtered.filter(art => {
        const lowerSrc = art.source.toLowerCase();
        return lowerSrc.includes("g1") || lowerSrc.includes("globo") || lowerSrc.includes("forbes");
      });
    }

    // Fallback to synchronous live fetch if cache is empty or insufficient
    if (filtered.length < max) {
      console.log(`[API/News] Insufficient articles for ${targetCategory} in Storage (${filtered.length}/${max}), fetching live...`);
      const freshArticles = await fetchNewsBackend({ query, category: targetCategory, max: max * 2, offset });
      
      const existingIds = new Set(filtered.map(a => a.id));
      for (const fa of freshArticles) {
        if (!existingIds.has(fa.id)) {
          filtered.push({
            ...fa,
            category: fa.category || targetCategory,
            score: fa.score || 0,
            importedAt: new Date().toISOString(),
            importanceScore: fa.score || 0
          });
        }
      }
    }

    // If query is specified, do title/desc text match (supporting "OR" separation)
    // Only apply if querying general news (Geral / Destaques) to avoid filtering out specific module news
    if (query && (category === "Geral" || category === "Destaques")) {
      const keywords = query.toLowerCase().split(/\s+or\s+/i).map(k => k.replace(/"/g, '').trim()).filter(Boolean);
      
      if (keywords.length > 0) {
        filtered = filtered.filter(art => {
          const title = art.title.toLowerCase();
          const desc = art.description.toLowerCase();
          return keywords.some(k => title.includes(k) || desc.includes(k));
        });
      }
    }

    // Filter out articles without valid images
    filtered = filtered.filter(art => {
      const img = art.image || "";
      const isBadImg = !img || img.includes("youtube.com") || img.includes("youtu.be") || img.includes("vimeo.com") || img.includes("/embed/");
      return !isBadImg;
    });

    // Sort by publish date and then import importance
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Apply natural rotation
    const rotated = rotateArticles(filtered, targetCategory);

    // Balance publishers before pagination
    const balanced = balanceArticlesBySource(rotated);
    const articles = balanced.slice(offset, offset + max);

    return NextResponse.json({
      articles,
      isFallback: articles.length === 0,
      lastSync: status.lastSync,
      lastSyncRelative: getRelativeTimeServer(status.lastSync)
    });
  } catch (error) {
    console.error("[API/News] Failed to serve articles:", error);
    return NextResponse.json({
      articles: [],
      isFallback: true,
      error: "Failed to fetch news",
    }, { status: 500 });
  }
}
