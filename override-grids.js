const fs = require('fs');

const replaces = [
  { f: 'app/page.tsx', q: 'Tecnologia OR Inovacao OR IA' },
  { f: 'components/news-cards-grid.tsx', q: 'Tecnologia OR Negocios' },
  { f: 'components/news-ticker.tsx', q: 'Tecnologia OR Startups OR Mercado' },
  { f: 'components/tecnologia/trending-tech.tsx', q: 'Tecnologia OR Hardware OR Software' },
  { f: 'components/business/growth-strategies.tsx', q: 'Economia OR Negocios OR Empresas' },
  { f: 'components/dev/framework-news.tsx', q: 'Programacao OR Desenvolvedor OR Software' },
  { f: 'components/ia/ai-tools.tsx', q: 'Inteligencia Artificial OR OpenAI' },
  { f: 'components/inovacao/innovation-cases.tsx', q: 'Inovacao OR Tecnologia OR Startup' },
  { f: 'components/startups/investment-rounds.tsx', q: 'Startup OR Investimento OR Fintech' },
  { f: 'components/trade/trade-articles.tsx', q: 'Acoes OR Mercado Financeiro OR B3' }
];

replaces.forEach(({f, q}) => {
  if (fs.existsSync(f)) {
    let t = fs.readFileSync(f, 'utf8');
    t = t.replace(/useNews\("[^"]+",/g, `useNews("${q}",`);
    fs.writeFileSync(f, t, 'utf8');
  }
});

console.log("Grid queries overridden");
