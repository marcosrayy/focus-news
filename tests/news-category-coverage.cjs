const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadService(fetch) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('services/newsService.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports: module.exports, module, fetch, URL, URLSearchParams, Date, TextDecoder, AbortSignal,
    console: { log() {}, warn() {}, error() {} },
    require: name => {
      if (name.includes('newsConfig')) return { NEWS_API_KEY: 'test', NEWSAPI_API_KEY: 'test' };
      if (name.includes('specialist-news-feeds')) return loadFeedConfig();
      return require(name);
    },
  });
  return module.exports;
}

function loadFeedConfig() {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('config/specialist-news-feeds.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, { exports: module.exports, module });
  return module.exports;
}

test('Dev and Startups accept relevant articles across primary categories', () => {
  const service = loadService();
  assert.equal(service.matchesDevOrStartupCategory('Startup fintech recebe aporte para expandir IA', '', 'Startupi', 'Startups'), true);
  assert.equal(service.matchesDevOrStartupCategory('GitHub amplia ferramentas de IA para desenvolvedores', '', 'Canaltech', 'Dev'), true);
  assert.equal(service.matchesDevOrStartupCategory('Smartphone tem nova bateria', '', 'Canaltech', 'Dev'), false);
  assert.equal(service.matchesDevOrStartupCategory('Startup recebe aporte', '', 'Unknown', 'Startups'), false);
  assert.equal(service.matchesDevOrStartupCategory('Startup recebe aporte', '', 'Startupi', 'Economia'), false);
});

test('technical and startup vocabulary is relevant without admitting unrelated subjects', () => {
  const service = loadService();
  assert.equal(service.hasCategoryEvidence('GraphQL para iniciantes com .NET', '', 'Dev'), true);
  assert.equal(service.hasCategoryEvidence('Falha crítica no PHP expõe sites', '', 'Dev'), true);
  assert.equal(service.hasCategoryEvidence('Edtech capta investimento para crescer', '', 'Startups'), true);
  assert.equal(service.hasCategoryEvidence('Empresa anuncia expansão', 'A startup criou uma plataforma de logística.', 'Startups'), true);
  assert.equal(service.matchesDevOrStartupCategory('Startup testa novos modelos de negócio', '', 'Startupi', 'Startups'), true);
  assert.equal(service.matchesDevOrStartupCategory('Python suporta novos modelos de IA', '', '4Linux', 'Dev'), true);
  assert.equal(service.matchesDevOrStartupCategory('Startup anuncia filme com atriz famosa', '', 'Startupi', 'Startups'), false);
  assert.equal(service.matchesDevOrStartupCategory('Governo apresenta plano para startups', '', 'Startupi', 'Startups'), false);
  assert.equal(service.matchesDevOrStartupCategory('Smartphone tem nova bateria', '', 'Mobile Time', 'Dev'), false);
  assert.equal(service.isArticleRejectedByPolicy('Empresa testa modelos', '', '', 'Economia'), true);
});

for (const [category, host, source, title] of [
  ['Dev', 'blog.4linux.com.br', '4Linux', 'GraphQL recebe integração com Python'],
  ['Startups', 'www.mobiletime.com.br', 'Mobile Time', 'Edtech recebe aporte para expandir'],
]) {
  test(`${category}: new source contributes only related articles even if other sources fail`, async () => {
    const service = loadService(async url => {
      if (!url.includes(host)) return { ok: false, status: 503 };
      return { ok: true, text: async () => `<rss><channel>${[title, 'Smartphone recebe nova bateria'].map((headline, i) =>
        `<item><title>${headline}</title><link>https://${host}/item-${i}</link><pubDate>${new Date().toUTCString()}</pubDate><description>Novidades do setor.</description></item>`
      ).join('')}</channel></rss>` };
    });
    const result = await service.fetchNewsBackend({ category, max: 16, preferLatest: true });
    assert.equal(result.length, 1);
    assert.equal(result[0].title, title);
    assert.equal(result[0].source, source);
    assert.equal(result[0].category, category);
  });
}

for (const category of ['Dev', 'Startups']) {
  test(`${category}: RSS supplements API results, keeps real sources and rejects old news`, async () => {
    const title = category === 'Dev'
      ? 'GitHub amplia ferramentas de IA para desenvolvedores'
      : 'Startup fintech recebe aporte para expandir IA';
    const source = category === 'Dev' ? 'Canaltech' : 'Startupi';
    const feedHost = category === 'Dev' ? 'tabnews.com.br' : 'startups.com.br';
    const rssTitle = category === 'Dev'
      ? 'Python recebe novo compilador para acelerar desenvolvimento de software'
      : 'Startup de logística capta investimento para entregas digitais';
    let rssCalls = 0;
    const service = loadService(async url => {
      if (url.includes('gnews.io')) return { ok: true, json: async () => ({ articles: [{
        title, description: '', source: { name: source }, url: 'https://example.com/api',
        publishedAt: new Date().toISOString(),
      }] }) };
      rssCalls++;
      if (!url.includes(feedHost)) return { ok: false, status: 503 };
      const xml = `<rss><channel>${[0, 30].map(days => `<item><title>${days ? 'Antiga: ' : ''}${rssTitle}</title><link>https://${feedHost}/article-${days}</link><pubDate>${new Date(Date.now() - days * 86400000).toUTCString()}</pubDate><description>Notícia sobre ${category === 'Dev' ? 'programação' : 'startups'}</description></item>`).join('')}</channel></rss>`;
      return { ok: true, text: async () => xml };
    });
    const result = await service.fetchNewsBackend({ category, max: 16, preferLatest: true });
    assert.ok(rssCalls > 0);
    assert.ok(result.some(a => a.url === 'https://example.com/api'));
    assert.ok(result.some(a => a.source === (category === 'Dev' ? 'TabNews' : 'Startups.com.br')));
    assert.ok(result.every(a => Date.now() - Date.parse(a.publishedAt) < 5 * 86400000));
  });
}
