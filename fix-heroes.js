const fs = require('fs');
const path = require('path');


const files = [
  'components/hero-article.tsx',
  'components/tecnologia/hero-tech.tsx',
  'components/business/hero-business.tsx',
  'components/dev/hero-dev.tsx',
  'components/ia/hero-ia.tsx',
  'components/inovacao/hero-inovacao.tsx',
  'components/startups/hero-startup.tsx',
  'components/trade/hero-trade.tsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Change `const { articles: news } = useNews` to include isLoading if not there
  content = content.replace(/const \{ articles: news \} = useNews/g, 'const { articles: news, isLoading } = useNews');

  // Add the fallback object
  const fallbackStr = ` || {
    title: "Destaques do dia em atualização",
    description: "Estamos buscando as últimas notícias para você. Se demorar, nosso serviço pode estar em manutenção.",
    image: "/placeholder.svg",
    category: "DESTAQUE",
    source: "FOCUS NEWS",
    url: "#",
    publishedAt: new Date().toISOString()
  }`;
  
  content = content.replace(/const article = news\?\.\[0\];/g, `const article = news?.[0]${fallbackStr};`);

  // Change `if (!article) {` to `if (isLoading && (!news || news.length === 0)) {`
  content = content.replace(/if \(!article\) \{/g, 'if (isLoading && (!news || news.length === 0)) {');

  fs.writeFileSync(fullPath, content);
  console.log(`Fixed ${file}`);
});
