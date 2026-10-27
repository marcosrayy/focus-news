// Read-only audit of public RSS feeds; does not load .env or call paid APIs.
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const responses = new Map();
const health = [];

function load(file, extra) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports: module.exports, module, URL, URLSearchParams, TextDecoder, AbortSignal,
    console: { log() {}, warn() {}, error() {} }, ...extra,
  });
  return module.exports;
}

const config = load('config/specialist-news-feeds.ts');
const service = load('services/newsService.ts', {
  require: name => {
    if (name.includes('newsConfig')) return { NEWS_API_KEY: '', NEWSAPI_API_KEY: '' };
    if (name.includes('specialist-news-feeds')) return config;
    return require(name);
  },
  fetch: async (url, options) => {
    if (url.includes('gnews.io')) return { ok: false, status: 503 };
    if (!responses.has(url)) {
      responses.set(url, (async () => {
        try {
          const response = await fetch(url, options);
          const body = await response.text();
          health.push({ url, status: response.status });
          return { ok: response.ok, status: response.status, text: async () => body };
        } catch (error) {
          health.push({ url, error: error.message });
          throw error;
        }
      })());
    }
    return responses.get(url);
  },
});

(async () => {
  for (const category of ['Dev', 'Startups']) {
    const articles = await service.fetchNewsBackend({ category, max: 100, preferLatest: true });
    const sources = {};
    for (const article of articles) sources[article.source] = (sources[article.source] || 0) + 1;
    console.log(JSON.stringify({ category, count: articles.length, sources, newest: articles[0]?.publishedAt }));
    if (process.argv.includes('--details')) {
      const urls = category === 'Dev'
        ? ['https://www.tabnews.com.br/rss', 'https://diolinux.com.br/feed', 'https://rss.tecmundo.com.br/feed', 'https://blog.4linux.com.br/feed/']
        : ['https://startups.com.br/feed/', 'https://startupi.com.br/feed/', 'https://neofeed.com.br/feed/', 'https://www.baguete.com.br/rss'];
      for (const url of urls) {
        const items = await service.fetchRssFeed(url);
        for (const item of items) {
          if (!service.isArticleWithinRetention(item.pubDate)) continue;
          const description = item.description.replace(/<[^>]+>/g, '');
          console.log(JSON.stringify({ category, url, title: item.title,
            policy: service.isArticleRejectedByPolicy(item.title, description, item.link, category),
            evidence: service.hasCategoryEvidence(item.title, description, category, item.link),
          }));
        }
      }
    }
  }
  console.log(JSON.stringify({ feeds: health }));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
