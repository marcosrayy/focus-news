const fs = require('fs');

let t = fs.readFileSync('services/newsService.ts', 'utf8');

const fallbackCode = `
const rssFeeds: Record<string, string> = {
  'Tecnologia': 'https://g1.globo.com/rss/g1/tecnologia/',
  'Economia': 'https://g1.globo.com/rss/g1/economia/',
  'Ciencia': 'https://g1.globo.com/rss/g1/ciencia-e-saude/',
  'Empreendedorismo': 'https://g1.globo.com/rss/g1/empreendedorismo/'
};

async function fetchRssFallback(category: string, max: number): Promise<NewsArticle[]> {
  try {
    let rssUrl = rssFeeds['Tecnologia'];
    const catLow = category.toLowerCase();
    if (catLow.includes('economia') || catLow.includes('business') || catLow.includes('mercado') || catLow.includes('trade')) rssUrl = rssFeeds['Economia'];
    else if (catLow.includes('ciencia') || catLow.includes('inovacao') || catLow.includes('inovação')) rssUrl = rssFeeds['Ciencia'];
    else if (catLow.includes('startup') || catLow.includes('empreendedorismo')) rssUrl = rssFeeds['Empreendedorismo'];
    
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl));
    const data = await response.json();
    if (data.status === 'ok') {
      return data.items.slice(0, max).map((item: any, index: number) => {
        let desc = item.description.replace(/<[^>]+>/g, '').trim();
        desc = desc.replace(/\\s+/g, ' ').substring(0, 150) + '...';
        return {
          id: 'rss-' + Date.now() + '-' + index,
          title: item.title,
          description: desc,
          url: item.link,
          image: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000',
          publishedAt: item.pubDate,
          source: item.author || 'Globo Tech',
          category: category.toUpperCase()
        };
      });
    }
  } catch (e) {
    console.error('RSS Fallback failed', e);
  }
  return [];
}
`;

// Inject before export async function fetchNewsBackend
t = t.replace('export async function fetchNewsBackend', fallbackCode + '\nexport async function fetchNewsBackend');

// Intercept empty arrays and throw errors
t = t.replace('return [];', 'return fetchRssFallback(category, max);'); // first one
t = t.replace('return [];', 'return fetchRssFallback(category, max);'); // second one

// When response is not ok
t = t.replace('throw new Error(`API Error: ${response.status} ${response.statusText}`);', 'return fetchRssFallback(category, max);');

// The GNews API error format: if data.errors exists, it also failed!
t = t.replace('const mapped = mapNewsResponse(data, provider, category);', `
    if (data.errors) {
      console.error("[newsService] API LIMIT HIT OR ERROR:", data.errors);
      return fetchRssFallback(category, max);
    }
    const mapped = mapNewsResponse(data, provider, category);`);

fs.writeFileSync('services/newsService.ts', t, 'utf8');
console.log('Added RSS Fallback');
