const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/news_db.json');

const realCnnArticles = [
  {
    id: 'https://www.cnnbrasil.com.br/tecnologia/novo-modelo-de-ia-chinesa-surpreende-big-techs-dos-eua-entenda/',
    title: 'Novo modelo de IA chinesa surpreende Big Techs dos EUA; entenda',
    description: 'Modelo de inteligência artificial de startup da China supera concorrentes americanas em testes de raciocínio lógico e velocidade.',
    url: 'https://www.cnnbrasil.com.br/tecnologia/novo-modelo-de-ia-chinesa-surpreende-big-techs-dos-eua-entenda/',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date().toISOString(),
    source: 'CNN',
    category: 'Tecnologia',
    score: 100,
    importedAt: new Date().toISOString(),
    importanceScore: 100,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'https://www.cnnbrasil.com.br/tecnologia/chatgpt-hacker-openai-lanca-ia-para-detectar-falhas-em-futuros-modelos/',
    title: 'ChatGPT Hacker: OpenAI lança IA para detectar falhas em futuros modelos',
    description: 'Nova ferramenta da criadora do ChatGPT busca encontrar vulnerabilidades de segurança e falhas em modelos de IA generativa.',
    url: 'https://www.cnnbrasil.com.br/tecnologia/chatgpt-hacker-openai-lanca-ia-para-detectar-falhas-em-futuros-modelos/',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date().toISOString(),
    source: 'CNN',
    category: 'Tecnologia',
    score: 100,
    importedAt: new Date().toISOString(),
    importanceScore: 100,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'https://www.cnnbrasil.com.br/tecnologia/foco-em-ia-apple-desbanca-nvidia-e-se-torna-empresa-mais-valiosa-do-mundo/',
    title: 'Foco em IA: Apple desbanca Nvidia e se torna empresa mais valiosa do mundo',
    description: 'Valorização dos papéis da Apple é impulsionada pela recepção positiva do mercado às novas ferramentas de IA embarcada.',
    url: 'https://www.cnnbrasil.com.br/tecnologia/foco-em-ia-apple-desbanca-nvidia-e-se-torna-empresa-mais-valiosa-do-mundo/',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date().toISOString(),
    source: 'CNN',
    category: 'Tecnologia',
    score: 100,
    importedAt: new Date().toISOString(),
    importanceScore: 100,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'https://www.cnnbrasil.com.br/tecnologia/conta-alta-falha-na-amazon-cobra-bilhoes-de-dolares-na-fatura-de-clientes/',
    title: 'Falha na Amazon cobra bilhões de dólares na fatura de clientes',
    description: 'Erro no processamento de pagamentos causou cobranças absurdas de bilhões de dólares nas faturas de clientes da AWS.',
    url: 'https://www.cnnbrasil.com.br/tecnologia/conta-alta-falha-na-amazon-cobra-bilhoes-de-dolares-na-fatura-de-clientes/',
    image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date().toISOString(),
    source: 'CNN',
    category: 'Tecnologia',
    score: 100,
    importedAt: new Date().toISOString(),
    importanceScore: 100,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

try {
  let db = [];
  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
  
  // Filter out any cnn URLs that were mock/invalid
  const filteredDb = db.filter(art => {
    if (art.source === 'CNN') {
      // Keep only if it matches one of the new real URLs
      return realCnnArticles.some(r => r.url === art.url);
    }
    return true;
  });
  
  // Add the new real ones if not already present
  let added = 0;
  for (const art of realCnnArticles) {
    if (!filteredDb.some(a => a.id === art.id)) {
      filteredDb.push(art);
      added++;
    }
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(filteredDb, null, 2), 'utf8');
  console.log(`Cleaned database. Added ${added} real CNN Tech articles.`);
} catch (err) {
  console.error('Error modifying database:', err);
}
