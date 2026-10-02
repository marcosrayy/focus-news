import { NextResponse } from "next/server";

import { balanceArticlesBySource, decodeHtmlEntities, deduplicateArticles, fetchNewsApiArticles, fetchNewsBackend, getFallbackNewsImage, hasCategoryEvidence, isArticleWithinRetention, isEnglishDevSource } from "../../../services/newsService";
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "Geral";
  const max = parseInt(searchParams.get("max") || "6", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const retentionDaysParam = parseInt(searchParams.get("retentionDays") || "", 10);
  const retentionDays = Number.isFinite(retentionDaysParam) && retentionDaysParam > 0 ? Math.min(retentionDaysParam, 90) : 3;

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

    const shouldMatchQuery = !!query && (category === "Geral" || category === "Destaques");
    const queryKeywords = shouldMatchQuery
      ? query.toLowerCase().split(/\s+or\s+/i).map(keyword => keyword.replace(/"/g, '').trim()).filter(Boolean)
      : [];
    const matchesQuery = (article: { title: string; description: string; content?: string; category?: string; source?: string }) => {
      const searchableText = [article.title, article.description, article.content, article.category, article.source]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return queryKeywords.some(keyword => searchableText.includes(keyword));
    };

    let filtered = allArticles.filter(art => 
      shouldMatchQuery ||
      art.category === targetCategory || 
      (targetCategory === "Home" && (art.category === "Startups" || art.category === "Tecnologia" || art.category === "Inovacao")) ||
      (targetCategory === "Startups" && art.source.toLowerCase().includes("exame")) ||
      (targetCategory === "Business" && art.source.toLowerCase().includes("forbes")) ||
      (targetCategory === "Business" && art.category === "Startups" && (art.source.toLowerCase().includes("startupi") || art.source.toLowerCase().includes("exame")))
    );

    // Strictly enforce sources for Inovacao to filter out old cached data
    if (targetCategory === "Inovacao") {
      filtered = filtered.filter(art => {
        const lowerSrc = art.source.toLowerCase();
        return lowerSrc.includes("g1") || lowerSrc.includes("globo") || lowerSrc.includes("forbes");
      });
    }

    if (targetCategory === "Dev") {
      filtered = filtered.filter(art => !isEnglishDevSource(art.source));
    }

    if (!shouldMatchQuery) {
      filtered = filtered.filter(art =>
        hasCategoryEvidence(art.title, art.description, targetCategory === "Home" ? art.category : targetCategory, art.url)
      );
    }

    if (shouldMatchQuery) filtered = filtered.filter(matchesQuery);
    filtered = filtered.filter(art => {
      if (retentionDays > 3) {
        const publishedTime = new Date(art.publishedAt).getTime();
        if (!Number.isFinite(publishedTime)) return false;
        return Date.now() - publishedTime <= retentionDays * 24 * 60 * 60 * 1000;
      }
      return isArticleWithinRetention(art.publishedAt, art.expiresAt);
    });
    filtered = deduplicateArticles(filtered);

    // Include the skipped featured article when deciding whether pagination has enough results.
    const requiredCount = max + offset;
    const shouldFetchSearchHistory = shouldMatchQuery && retentionDays > 3;
    const hasCachedSectionResults = !shouldMatchQuery && filtered.length > 0;
    if (shouldFetchSearchHistory || (filtered.length < requiredCount && !hasCachedSectionResults)) {
      console.log(`[API/News] Insufficient articles for ${targetCategory} in Storage (${filtered.length}/${requiredCount}), fetching live...`);
      const freshArticles = shouldMatchQuery
        ? (await Promise.all(
            [
              fetchNewsApiArticles({ query, max: requiredCount, retentionWindowDays: retentionDays }),
              ...["Tecnologia", "Economia", "Business", "Inovacao", "Dev", "IA", "Startups"].map(searchCategory =>
                fetchNewsBackend({ query, category: searchCategory, max: requiredCount, offset: 0, retentionWindowDays: retentionDays })
              ),
            ]
          )).flat()
        : await fetchNewsBackend({ query, category: targetCategory, max: requiredCount, offset: 0 });
      
      const existingIds = new Set(filtered.map(a => a.id));
      for (const fa of freshArticles) {
        if (shouldMatchQuery && !matchesQuery(fa)) continue;
        if (!existingIds.has(fa.id)) {
          existingIds.add(fa.id);
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

    if (!shouldMatchQuery) {
      filtered = filtered.filter(art =>
        hasCategoryEvidence(
          art.title,
          art.description,
          targetCategory === "Home" ? art.category || "" : targetCategory,
          art.url,
        )
      );
    }

    filtered = filtered.map(art => {
      const image = art.image || "";
      const lowerImage = image.toLowerCase();
      const isBadImage = !image || lowerImage.includes("youtube.com") || lowerImage.includes("youtu.be") || lowerImage.includes("vimeo.com") || lowerImage.includes("/embed/");
      return {
        ...(isBadImage ? { ...art, image: getFallbackNewsImage(art.url || art.title || art.source || art.category || "news", targetCategory) } : art),
        title: art.title ? decodeHtmlEntities(art.title) : art.title,
        description: art.description ? decodeHtmlEntities(art.description) : art.description,
      };
    });
    filtered = filtered.filter(art => {
      if (retentionDays > 3) {
        const publishedTime = new Date(art.publishedAt).getTime();
        if (!Number.isFinite(publishedTime)) return false;
        return Date.now() - publishedTime <= retentionDays * 24 * 60 * 60 * 1000;
      }
      return isArticleWithinRetention(art.publishedAt, art.expiresAt);
    });
    filtered = deduplicateArticles(filtered);

    // Keep ordering stable so separate hero/list requests paginate the same set.
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Balance publishers before pagination
    const balanced = balanceArticlesBySource(filtered);
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
