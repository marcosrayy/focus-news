import { Storage, StorageArticle, EngineStatus } from '../utils/storage';
import { classifyArticle, deduplicateArticles, fetchRssFeed, hasCategoryEvidence, isArticleWithinRetention, isCategorySpecificRssFeed, isEnglishDevSource, isSourceAllowed, MODULE_SOURCES, repairMojibake } from './newsService';
import { NEWS_API_KEY } from '../config/newsConfig';

// Categories mapping to RSS feeds
const FALLBACK_FEEDS: Record<string, string[]> = {
  Startups: [
    'https://startupi.com.br/feed/',
    'https://forbes.com.br/category/colunas/forbes-tech/feed/'
  ],
  Economia: [
    'https://www.infomoney.com.br/feed/',
    'https://startupi.com.br/feed/',
    'https://valor.globo.com/rss/valor/',
    'https://g1.globo.com/rss/g1/economia/'
  ],
  IA: [
    'https://canaltech.com.br/rss/',
    'https://startupi.com.br/feed/',
    'https://rss.tecmundo.com.br/feed',
    'https://www.cnnbrasil.com.br/tudo-sobre/inteligencia-artificial/feed/',
    'https://forbes.com.br/noticias-sobre/inteligencia-artificial/feed/'
  ],
  Tecnologia: [
    'https://tecnoblog.net/feed/',
    'https://rss.tecmundo.com.br/feed',
    'https://g1.globo.com/rss/g1/tecnologia/',
    'https://www.cnnbrasil.com.br/feed/'
  ],
  Dev: [
    'https://diolinux.com.br/feed',
    'https://tecnoblog.net/feed/',
    'https://rss.tecmundo.com.br/feed',
    'https://canaltech.com.br/rss/',
    'https://forbes.com.br/noticias-sobre/desenvolvimento-de-software/feed/',
    'https://www.tabnews.com.br/rss'
  ],
  Inovacao: [
    'https://g1.globo.com/rss/g1/inovacao/',
    'https://forbes.com.br/noticias-sobre/inovacao/feed/'
  ],
  Business: [
    'https://startupi.com.br/feed/',
    'https://www.infomoney.com.br/feed/',
    'https://forbes.com.br/category/colunas/forbes-tech/feed/'
  ],
};

// Target categories to process in a refresh cycle
const CATEGORIES = ['Startups', 'Economia', 'IA', 'Tecnologia', 'Dev', 'Inovacao', 'Business'];

// Helper to determine the source label based on feed URL
function getFeedSourceName(feedUrl: string): string {
  const url = feedUrl.toLowerCase();
  if (url.includes('startupi')) return 'Startupi';
  if (url.includes('infomoney')) return 'InfoMoney';
  if (url.includes('valor.globo')) return 'Valor';
  if (url.includes('canaltech')) return 'Canaltech';
  if (url.includes('tecnoblog')) return 'Tecnoblog';
  if (url.includes('diolinux')) return 'Diolinux';
  if (url.includes('gizmodo')) return 'Gizmodo';
  if (url.includes('tecmundo')) return 'TechMundo';
  if (url.includes('globo.com')) return 'Globo';
  if (url.includes('cnnbrasil')) return 'CNN';
  if (url.includes('tabnews.com.br')) return 'TabNews';
  if (url.includes('forbes')) return 'Forbes';
  return 'GNews';
}

function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com') || lower.includes('/embed/')) {
    return false;
  }
  
  return lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('/');
}

// Calculate retention period based on content analysis
function calculateExpirationDate(title: string, desc: string, publishedAt: string): string {
  const text = `${title} ${desc}`.toLowerCase();
  const pubTime = new Date(publishedAt).getTime();
  
  // Breaking News: 6 hours
  const isBreaking = ['urgente', 'breaking', 'plantao', 'exclusivo', 'extra', 'urgência'].some(kw => text.includes(kw));
  if (isBreaking) {
    return new Date(pubTime + 6 * 60 * 60 * 1000).toISOString();
  }

  // Analyses / Special features: 48 hours
  const isAnalysis = ['analise', 'especial', 'estudo', 'pesquisa', 'entrevista', 'opiniao'].some(kw => text.includes(kw));
  if (isAnalysis) {
    return new Date(pubTime + 48 * 60 * 60 * 1000).toISOString();
  }

  // Normal Tech/Market news: 24 hours
  const isMarketTech = ['mercado', 'selic', 'bolsa', 'ações', 'dólar', 'chip', 'lançamento', 'iphone', 'samsung'].some(kw => text.includes(kw));
  if (isMarketTech) {
    return new Date(pubTime + 24 * 60 * 60 * 1000).toISOString();
  }

  // Common and evergreen articles remain valid for at most 5 days
  return new Date(pubTime + 5 * 24 * 60 * 60 * 1000).toISOString();
}

// Simple hash utility to compare article bodies/titles
function calculateHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// Flag to prevent overlapping sync runs
let isRunningSync = false;

export const RefreshEngine = {
  async runSync(forceFull = false): Promise<{ success: boolean; stats: any }> {
    if (isRunningSync) {
      console.warn('[RefreshEngine] Sync is already running. Skipping overlapping run.');
      return { success: false, stats: { error: 'Sync already running' } };
    }
    isRunningSync = true;
    const startTime = Date.now();
    console.log('[RefreshEngine] Starting synchronization cycle...');

    // Load existing database and status
    const existingArticles = Storage.readArticles();
    const status = Storage.readStatus();
    
    // Track stats for this run
    let importedThisRun = 0;
    let updatedThisRun = 0;
    let discardedThisRun = 0;
    const processedUrls = new Set<string>();

    const sourceHealth: Record<string, { status: 'Online' | 'Instável' | 'Offline'; lastResponseMs: number; lastChecked: string }> = { ...status.sourcesHealth };

    // Set of IDs already in the DB to check updates vs inserts
    const articleMap = new Map<string, StorageArticle>();
    existingArticles.forEach(art => articleMap.set(art.id, art));

    // GNews API Search Sync
    if (NEWS_API_KEY) {
      const gnewsStart = Date.now();
      try {
        console.log('[RefreshEngine] Fetching fresh updates from GNews search API...');
        const q = "Startups OR Tecnologia OR Inovacao OR Negocios";
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=pt&max=15&apikey=${NEWS_API_KEY}`;
        const res = await fetch(url);
        const fetchDuration = Date.now() - gnewsStart;
        
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.articles)) {
            sourceHealth['GNews'] = {
              status: 'Online',
              lastResponseMs: fetchDuration,
              lastChecked: new Date().toISOString()
            };
            
            for (const item of data.articles) {
              const articleUrl = item.url;
              if (processedUrls.has(articleUrl)) continue;
              processedUrls.add(articleUrl);
              
              const title = repairMojibake(item.title || "");
              const cleanDesc = repairMojibake(item.description || "");
              const sourceLabel = item.source?.name || "GNews";
              const classification = classifyArticle(title, cleanDesc, sourceLabel, articleUrl);
              const articleCategory = classification.category;
              
              if (articleCategory === "Rejeitado") continue;
              
              const publishedAt = item.publishedAt || new Date().toISOString();
              const expDate = calculateExpirationDate(title, cleanDesc, publishedAt);
              
              if (new Date(expDate).getTime() < Date.now()) {
                discardedThisRun++;
                continue;
              }
              
              const articleEntry: StorageArticle & { expiresAt: string } = {
                id: articleUrl,
                title,
                description: cleanDesc,
                url: articleUrl,
                image: item.image || "",
                publishedAt,
                source: sourceLabel,
                category: articleCategory,
                score: classification.score,
                importedAt: new Date().toISOString(),
                importanceScore: classification.score + (title.toLowerCase().includes('urgente') ? 30 : 0),
                expiresAt: expDate
              };
              
              if (articleMap.has(articleUrl)) {
                const existing = articleMap.get(articleUrl)!;
                articleMap.set(articleUrl, {
                  ...existing,
                  title: articleEntry.title,
                  description: articleEntry.description,
                  image: articleEntry.image,
                  score: articleEntry.score,
                  importanceScore: articleEntry.importanceScore,
                });
                updatedThisRun++;
              } else {
                const isDuplicateTitle = Array.from(articleMap.values()).some(
                  art => art.category === articleCategory && 
                  calculateHash(art.title.slice(0, 30)) === calculateHash(articleEntry.title.slice(0, 30))
                );
                
                if (isDuplicateTitle) {
                  discardedThisRun++;
                  continue;
                }
                
                articleMap.set(articleUrl, articleEntry);
                importedThisRun++;
              }
            }
          }
        } else {
          throw new Error(`HTTP status ${res.status}`);
        }
      } catch (err) {
        console.warn(`[RefreshEngine] GNews API fetch failed:`, err);
        sourceHealth['GNews'] = {
          status: 'Instável',
          lastResponseMs: Date.now() - gnewsStart,
          lastChecked: new Date().toISOString()
        };
      }
    }

    // CNN Brasil GNews API Search
    if (NEWS_API_KEY) {
      const cnnStart = Date.now();
      try {
        console.log('[RefreshEngine] Fetching CNN Brasil technology updates from GNews search API...');
        const cnnUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent("CNN Brasil")}&lang=pt&max=10&apikey=${NEWS_API_KEY}`;
        const cnnRes = await fetch(cnnUrl);
        const cnnDuration = Date.now() - cnnStart;
        if (cnnRes.ok) {
          const cnnData = await cnnRes.json();
          if (cnnData && Array.isArray(cnnData.articles)) {
            sourceHealth['CNN'] = {
              status: 'Online',
              lastResponseMs: cnnDuration,
              lastChecked: new Date().toISOString()
            };
            for (const item of cnnData.articles) {
              const articleUrl = item.url;
              if (processedUrls.has(articleUrl)) continue;
              processedUrls.add(articleUrl);
              
              const title = repairMojibake(item.title || "");
              const cleanDesc = repairMojibake(item.description || "");
              const sourceLabel = "CNN";
              const classification = classifyArticle(title, cleanDesc, sourceLabel, articleUrl);
              const articleCategory = classification.category;
              
              if (articleCategory === "Rejeitado") continue;
              
              const publishedAt = item.publishedAt || new Date().toISOString();
              const expDate = calculateExpirationDate(title, cleanDesc, publishedAt);
              
              if (new Date(expDate).getTime() < Date.now()) {
                discardedThisRun++;
                continue;
              }
              
              const articleEntry: StorageArticle & { expiresAt: string } = {
                id: articleUrl,
                title,
                description: cleanDesc,
                url: articleUrl,
                image: item.image || "",
                publishedAt,
                source: sourceLabel,
                category: articleCategory,
                score: classification.score,
                importedAt: new Date().toISOString(),
                importanceScore: classification.score + (title.toLowerCase().includes('urgente') ? 30 : 0),
                expiresAt: expDate
              };
              
              if (articleMap.has(articleUrl)) {
                const existing = articleMap.get(articleUrl)!;
                articleMap.set(articleUrl, {
                  ...existing,
                  title: articleEntry.title,
                  description: articleEntry.description,
                  image: articleEntry.image,
                  score: articleEntry.score,
                  importanceScore: articleEntry.importanceScore,
                });
                updatedThisRun++;
              } else {
                const isDuplicateTitle = Array.from(articleMap.values()).some(
                  art => art.category === articleCategory && 
                  calculateHash(art.title.slice(0, 30)) === calculateHash(articleEntry.title.slice(0, 30))
                );
                
                if (isDuplicateTitle) {
                  discardedThisRun++;
                  continue;
                }
                
                articleMap.set(articleUrl, articleEntry);
                importedThisRun++;
              }
            }
          }
        }
      } catch (err) {
        console.warn(`[RefreshEngine] CNN GNews API fetch failed:`, err);
      }
    }

    // Exame Startups crawler
    const exameStart = Date.now();
    try {
      console.log('[RefreshEngine] Crawling Exame Startups page directly...');
      const response = await fetch('https://exame.com/noticias-sobre/Startups/1/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html'
        }
      });
      const fetchDuration = Date.now() - exameStart;
      if (response.ok) {
        const html = await response.text();
        
        // Build image map
        const imageMap = new Map<string, string>();
        const imgRegex1 = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]+alt=["']([^"']+)["']/gi;
        const imgRegex2 = /<img[^>]+alt=["']([^"']+)["'][^>]+src=["'](https?:\/\/[^"']+)["']/gi;
        
        let imgMatch;
        while ((imgMatch = imgRegex1.exec(html)) !== null) {
          const imgSrc = imgMatch[1].trim();
          const imgTitle = imgMatch[2].trim();
          imageMap.set(imgTitle, imgSrc);
        }
        while ((imgMatch = imgRegex2.exec(html)) !== null) {
          const imgTitle = imgMatch[1].trim();
          const imgSrc = imgMatch[2].trim();
          imageMap.set(imgTitle, imgSrc);
        }

        const regex = /href="(https:\/\/exame\.com\/[^"]+)" class="touch-area">([^<]+)<\/a>/g;
        let match;
        let importedExame = 0;
        
        while ((match = regex.exec(html)) !== null) {
          const articleUrl = match[1];
          const rawTitle = match[2].trim();
          const articleTitle = repairMojibake(rawTitle
            .replace(/&#x27;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>'));
            
          if (processedUrls.has(articleUrl)) continue;
          processedUrls.add(articleUrl);
          
          const cleanDesc = `Acompanhe notícias sobre startups, negócios e ecossistema de inovação na revista Exame.`;
          const sourceLabel = "Exame";
          const articleCategory = "Startups";
          
          const publishedAt = new Date().toISOString();
          const expDate = calculateExpirationDate(articleTitle, cleanDesc, publishedAt);
          
          // Get real image from map or fall back
          const realImage = imageMap.get(articleTitle) || imageMap.get(rawTitle) || "";
          
          const articleEntry: StorageArticle & { expiresAt: string } = {
            id: articleUrl,
            title: articleTitle,
            description: cleanDesc,
            url: articleUrl,
            image: realImage,
            publishedAt,
            source: sourceLabel,
            category: articleCategory,
            score: 100,
            importedAt: new Date().toISOString(),
            importanceScore: 100,
            expiresAt: expDate
          };
          
          if (articleMap.has(articleUrl)) {
            const existing = articleMap.get(articleUrl)!;
            articleMap.set(articleUrl, {
              ...existing,
              title: articleEntry.title,
              image: articleEntry.image, // update image to real cover
            });
          } else {
            const isDuplicateTitle = Array.from(articleMap.values()).some(
              art => art.category === articleCategory && 
              calculateHash(art.title.slice(0, 30)) === calculateHash(articleEntry.title.slice(0, 30))
            );
            
            if (isDuplicateTitle) {
              continue;
            }
            
            articleMap.set(articleUrl, articleEntry);
            importedExame++;
            importedThisRun++;
          }
        }
        console.log(`[RefreshEngine] Exame Startups crawl finished. Imported: ${importedExame}`);
        sourceHealth['Exame'] = {
          status: 'Online',
          lastResponseMs: fetchDuration,
          lastChecked: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn(`[RefreshEngine] Exame Startups crawl failed:`, err);
    }

    // Iterate over each category to update its specific feeds
    for (const category of CATEGORIES) {
      const feeds = FALLBACK_FEEDS[category] || [];
      
      for (const feedUrl of feeds) {
        const sourceName = getFeedSourceName(feedUrl);
        const feedStart = Date.now();
        
        try {
          const items = await fetchRssFeed(feedUrl);
          const fetchDuration = Date.now() - feedStart;

          // Mark source as Online
          sourceHealth[sourceName] = {
            status: 'Online',
            lastResponseMs: fetchDuration,
            lastChecked: new Date().toISOString()
          };

          for (const item of items) {
            const articleUrl = item.link;
            if (processedUrls.has(articleUrl)) continue;
            processedUrls.add(articleUrl);

            // Fetch image URL if present
            let imageUrl = item.enclosure?.link || item.thumbnail;
            if (!imageUrl && item.description) {
              const match = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
              if (match) imageUrl = match[1];
            }
            if (!imageUrl && item.content) {
              const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
              if (match) imageUrl = match[1];
            }
            if (!imageUrl || !isValidImageUrl(imageUrl)) {
              imageUrl = "";
            }

            const title = repairMojibake(item.title || "");
            let cleanDesc = repairMojibake((item.description || "").replace(/<[^>]+>/g, ''));
            // Strip Forbes boilerplates
            cleanDesc = cleanDesc.replace(/Forbes, a mais conceituada revista de negócios e economia do mundo\./gi, '');
            cleanDesc = cleanDesc.replace(/O post .* apareceu primeiro em .*$/gi, '');
            cleanDesc = cleanDesc.trim().slice(0, 150) + '...';

            // Run classification
            const classification = classifyArticle(title, cleanDesc, sourceName, articleUrl);
            let articleCategory = classification.category;

            // Apply Startups / Business mapping override as per request
            if (category === "Startups" && sourceName === "Startupi" && (articleCategory === "Startups" || articleCategory === "Business")) {
              articleCategory = "Startups";
            }
            if (category === "Inovacao") {
              articleCategory = "Inovacao";
            }
            if (isCategorySpecificRssFeed(feedUrl, category)) {
              articleCategory = category;
            }

            // Verify category compatibility (only reject if classified as Rejeitado)
            if (articleCategory === "Rejeitado" || !hasCategoryEvidence(title, cleanDesc, articleCategory)) {
              discardedThisRun++;
              continue;
            }

            const publishedAt = item.pubDate || new Date().toISOString();
            const expDate = calculateExpirationDate(title, cleanDesc, publishedAt);

            // Skip expired articles
            if (new Date(expDate).getTime() < Date.now()) {
              discardedThisRun++;
              continue;
            }

            // Create article entry
            const articleEntry: StorageArticle & { expiresAt: string } = {
              id: articleUrl,
              title,
              description: cleanDesc,
              url: articleUrl,
              image: imageUrl,
              publishedAt,
              source: sourceName,
              category: articleCategory,
              score: classification.score,
              importedAt: new Date().toISOString(),
              importanceScore: classification.score + (title.toLowerCase().includes('urgente') ? 30 : 0),
              expiresAt: expDate
            };

            if (articleMap.has(articleUrl)) {
              // Update existing
              const existing = articleMap.get(articleUrl)!;
              articleMap.set(articleUrl, {
                ...existing,
                title: articleEntry.title,
                description: articleEntry.description,
                image: articleEntry.image,
                score: articleEntry.score,
                importanceScore: articleEntry.importanceScore,
                // keep the original import date
              });
              updatedThisRun++;
            } else {
              // Deduplicate by normalized title
              const isDuplicateTitle = Array.from(articleMap.values()).some(
                art => art.category === articleCategory && 
                calculateHash(art.title.slice(0, 30)) === calculateHash(articleEntry.title.slice(0, 30))
              );
              
              if (isDuplicateTitle) {
                discardedThisRun++;
                continue;
              }

              // Insert new
              articleMap.set(articleUrl, articleEntry);
              importedThisRun++;
            }
          }

        } catch (err) {
          console.warn(`[RefreshEngine] Feed error on ${sourceName} (${feedUrl}):`, err);
          // Mark source as Instável or Offline
          sourceHealth[sourceName] = {
            status: sourceHealth[sourceName]?.status === 'Instável' ? 'Offline' : 'Instável',
            lastResponseMs: Date.now() - feedStart,
            lastChecked: new Date().toISOString()
          };
        }
      }
    }

    // Apply expiration (retention logic) - filter out expired news
    const nowTime = Date.now();
    const finalArticles = deduplicateArticles(Array.from(articleMap.values()).filter(art =>
      !(art.category === "Dev" && isEnglishDevSource(art.source)) &&
      isArticleWithinRetention(art.publishedAt, art.expiresAt, nowTime)
    ));

    // Save final lists back to storage
    await Storage.saveArticles(finalArticles);

    // Save Sync Run Log and Status
    const syncDuration = Date.now() - startTime;
    const historyEntry = {
      timestamp: new Date().toISOString(),
      durationMs: syncDuration,
      importedCount: importedThisRun,
      updatedCount: updatedThisRun,
      discardedCount: discardedThisRun,
      modules: CATEGORIES
    };

    const newStatus: EngineStatus = {
      lastSync: new Date().toISOString(),
      syncHistory: [historyEntry, ...status.syncHistory].slice(0, 50), // keep last 50 logs
      sourcesHealth: sourceHealth,
      stats: {
        imported: status.stats.imported + importedThisRun,
        updated: status.stats.updated + updatedThisRun,
        discarded: status.stats.discarded + discardedThisRun
      }
    };

    await Storage.saveStatus(newStatus);
    console.log(`[RefreshEngine] Sync cycle finished in ${syncDuration}ms. Imported: ${importedThisRun}, Updated: ${updatedThisRun}, Discarded: ${discardedThisRun}`);

    isRunningSync = false;
    return {
      success: true,
      stats: {
        durationMs: syncDuration,
        imported: importedThisRun,
        updated: updatedThisRun,
        discarded: discardedThisRun
      }
    };
  }
};
