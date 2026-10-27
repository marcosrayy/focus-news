const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup(category) {
  const article = (id, hours, source = 'G1') => ({
    id, title: id, description: '', url: `https://example.com/${id}`,
    image: '/news.jpg', category, source,
    publishedAt: new Date(Date.now() - hours * 3600000).toISOString(),
  });
  const stored = [article('recent', 1), article('next', 2), article('expired', 240, 'B')];
  const calls = [];
  const service = {
    balanceArticlesBySource: items => [...items.filter(a => a.source === 'B'), ...items.filter(a => a.source !== 'B')],
    decodeHtmlEntities: s => s,
    deduplicateArticles: items => [...new Map(items.map(a => [a.id, a])).values()],
    hasCategoryEvidence: () => true,
    isEnglishDevSource: () => false,
    matchesDevOrStartupCategory: () => false,
    isArticleWithinRetention: date => Date.now() - Date.parse(date) < 5 * 86400000,
    fetchNewsBackend: async options => { calls.push(options); return [article('live', 0.1)]; },
  };
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('app/api/news/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports: module.exports, module, URL, Date, console: { log() {}, error() {} },
    require: name => {
      if (name === 'next/server') return { NextResponse: { json: body => body }, after() {} };
      if (name.includes('newsService')) return service;
      if (name.includes('storage')) return { Storage: {
        readStatus: async () => ({ lastSync: new Date().toISOString() }),
        readArticles: async () => stored,
      } };
      if (name.includes('refreshEngine')) return { RefreshEngine: {} };
      throw new Error(name);
    },
  });
  return { get: params => module.exports.GET({ url: `https://local/api/news?category=${category}&${params}` }), calls };
}

for (const category of ['Tecnologia', 'Startups', 'IA', 'Dev', 'Inovacao', 'Business']) {
  test(`${category}: refresh even with enough recent stored articles, exclude expired, paginate by date`, async () => {
    const { get, calls } = setup(category);
    const first = await get('max=2');
    assert.deepEqual(Array.from(first.articles, a => a.id), ['live', 'recent']);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].preferLatest, true);
    const second = await get('max=2&offset=1');
    assert.deepEqual(Array.from(second.articles, a => a.id), ['recent', 'next']);
    assert.equal(second.totalArticles, 3);
  });
}

test('Economia keeps archive, source ordering and existing refresh behavior', async () => {
  const { get, calls } = setup('Economia');
  const result = await get('max=2&archive=true');
  assert.deepEqual(Array.from(result.articles, a => a.id), ['expired', 'recent']);
  assert.equal(calls.length, 0);
});

test('repeated refresh requests reuse the live cache', async () => {
  const { get, calls } = setup('Tecnologia');
  await get('max=2');
  await get('max=2');
  assert.equal(calls.length, 1);
});
