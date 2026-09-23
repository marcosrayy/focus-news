const fs = require('fs');

let t = fs.readFileSync('services/newsService.ts', 'utf8');

const newFallback = `
const rssFeeds: Record<string, string[]> = {
  'Geral': ['https://forbes.com.br/feed/', 'https://www.poder360.com.br/feed/', 'https://exame.com/feed/'],
  'Economia': ['https://valor.globo.com/rss/valor/', 'https://www.infomoney.com.br/feed/'],
  'Business': ['https://exame.com/feed/', 'https://forbes.com.br/feed/'],
  'Mercado': ['https://www.infomoney.com.br/mercados/feed/', 'https://valor.globo.com/rss/valor/'],
  'Tecnologia': ['https://olhardigital.com.br/feed/', 'https://canaltech.com.br/rss/'],
  'IA': ['https://canaltech.com.br/rss/', 'https://olhardigital.com.br/feed/'],
  'Inovacao': ['https://forbes.com.br/feed/', 'https://olhardigital.com.br/feed/'],
  'Startups': ['https://forbes.com.br/feed/', 'https://exame.com/feed/'],
  'Ciencia': ['https://olhardigital.com.br/feed/', 'https://canaltech.com.br/rss/']
};

function getSourceFromUrl(url: string): string {
  if (url.includes('forbes')) return 'Forbes Brasil';
  if (url.includes('poder360')) return 'Poder360';
  if (url.includes('exame')) return 'Exame';
  if (url.includes('valor')) return 'Valor Econômico';
  if (url.includes('infomoney')) return 'InfoMoney';
  if (url.includes('olhardigital')) return 'Olhar Digital';
  if (url.includes('canaltech')) return 'Canaltech';
  return 'Premium Tech';
}

async function fetchRssFallback(category: string, max: number): Promise<NewsArticle[]> {
  try {
    const catLow = category.toLowerCase();
    let feedOptions = rssFeeds['Geral'];
    
    if (catLow.includes('economia')) feedOptions = rssFeeds['Economia'];
    else if (catLow.includes('business')) feedOptions = rssFeeds['Business'];
    else if (catLow.includes('mercado') || catLow.includes('trade')) feedOptions = rssFeeds['Mercado'];
    else if (catLow.includes('tecnologia') || catLow.includes('dev')) feedOptions = rssFeeds['Tecnologia'];
    else if (catLow.includes('ia') || catLow.includes('inteligencia')) feedOptions = rssFeeds['IA'];
    else if (catLow.includes('inovacao') || catLow.includes('inovação')) feedOptions = rssFeeds['Inovacao'];
    else if (catLow.includes('startup') || catLow.includes('empreendedorismo')) feedOptions = rssFeeds['Startups'];
    else if (catLow.includes('ciencia')) feedOptions = rssFeeds['Ciencia'];

    // Pick a random feed from the options to ensure variety
    const rssUrl = feedOptions[Math.floor(Math.random() * feedOptions.length)];
    const sourceName = getSourceFromUrl(rssUrl);
    
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl));
    const data = await response.json();
    
    if (data.status === 'ok') {
      // Shuffle the items to prevent repetition across sections
      let items = data.items;
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      
      return items.slice(0, max).map((item: any, index: number) => {
        let desc = item.description.replace(/<[^>]+>/g, '').trim();
        desc = desc.replace(/\\s+/g, ' ').substring(0, 150) + '...';
        return {
          id: 'rss-' + Date.now() + '-' + index,
          title: item.title,
          description: desc,
          url: item.link,
          image: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000',
          publishedAt: item.pubDate,
          source: sourceName,
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

// We need to replace the OLD fallback code with this new one
const regex = /const rssFeeds: Record<string, string> = \{[\s\S]*?return \[\];\n\}/m;

t = t.replace(regex, newFallback.trim());

fs.writeFileSync('services/newsService.ts', t, 'utf8');
console.log('Premium RSS feeds injected!');
