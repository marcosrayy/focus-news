const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  { path: 'business/growth-strategies.tsx', name: 'GrowthStrategies', query: '"Negócios OR Crescimento OR Empresa", "Business"' },
  { path: 'dev/framework-news.tsx', name: 'FrameworkNews', query: '"Software OR Framework OR Web Dev", "Dev"' },
  { path: 'ia/ai-tools.tsx', name: 'AITools', query: '"Inteligência Artificial OR Ferramentas IA", "IA"' },
  { path: 'inovacao/innovation-cases.tsx', name: 'InnovationCases', query: '"Inovação OR Tecnologia OR Futuro", "Inovacao"' },
  { path: 'startups/investment-rounds.tsx', name: 'InvestmentRounds', query: '"Startup OR Investimento OR Venture Capital", "Startups"' }
];

filesToUpdate.forEach(f => {
  const fullPath = path.join('components', f.path);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Check if already injected
  if (content.includes('useNews')) return;

  // Add import
  if (!content.includes('useNews')) {
    content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useNews } from "@/hooks/useNews";');
  }

  // Inject hook and map logic
  const functionRegex = new RegExp(`export function ${f.name}\\(\\) \\{\\s*const \\[selected, setSelected\\] = useState[^\n]+;`);
  
  const injection = `export function ${f.name}() {
  const [selected, setSelected] = useState<any | null>(null);
  const { articles: apiNews } = useNews(${f.query}, 6);
  const displayArticles = apiNews.length > 0 ? apiNews.map((n: any, i: number) => {
    const mock = articles[i % articles.length];
    return { ...mock, title: n.title, description: n.description, image: n.image || "/placeholder.svg", url: n.url, time: "agora" };
  }) : articles;`;

  content = content.replace(functionRegex, injection);

  // Change articles.slice to displayArticles.slice
  content = content.replace(/articles\.slice/g, 'displayArticles.slice');
  
  // Change onClick to window.open if they used ArticleModal, or just adapt onClick in the JSX mapping
  // The original has onClick={() => setSelected(article)}
  // Let's replace setSelected(article) with window.open(article.url || article.image, "_blank")
  // wait, article.url is from the API.
  content = content.replace(/setSelected\(article\)/g, 'article.url ? window.open(article.url, "_blank") : setSelected(article)');

  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${f.path}`);
});
