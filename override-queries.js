const fs = require('fs');

const replaces = [
  { f: 'components/hero-article.tsx', q: 'Tecnologia OR Inteligencia Artificial OR Software' },
  { f: 'components/tecnologia/hero-tech.tsx', q: 'Hardware OR Processador OR Inovacao' },
  { f: 'components/business/hero-business.tsx', q: 'Business OR Empreendedorismo OR CEO' },
  { f: 'components/dev/hero-dev.tsx', q: 'Programacao OR Desenvolvimento OR Web' },
  { f: 'components/ia/hero-ia.tsx', q: 'Inteligencia Artificial OR IA OR ChatGPT' },
  { f: 'components/inovacao/hero-inovacao.tsx', q: 'Inovacao OR Tecnologia Sustentavel OR Futuro' },
  { f: 'components/startups/hero-startup.tsx', q: 'Startup OR Investimento OR Empreendedor' },
  { f: 'components/trade/hero-trade.tsx', q: 'Trade OR Mercado Financeiro OR Acoes' }
];

replaces.forEach(({f, q}) => {
  if (fs.existsSync(f)) {
    let t = fs.readFileSync(f, 'utf8');
    t = t.replace(/useNews\("[^"]+",/g, `useNews("${q}",`);
    fs.writeFileSync(f, t, 'utf8');
  }
});

console.log("Queries overridden");
