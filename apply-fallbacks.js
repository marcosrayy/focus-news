const fs = require('fs');
const fallbacks = [
  { f: 'components/hero-article.tsx', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000', cat: 'TECNOLOGIA', t: 'A Revolução dos Semicondutores' },
  { f: 'components/tecnologia/hero-tech.tsx', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000', cat: 'HARDWARE', t: 'Novos Chips Prometem Dobrar a Velocidade' },
  { f: 'components/business/hero-business.tsx', img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=2000', cat: 'BUSINESS', t: 'Startups Unicórnio em Alta no Mercado' },
  { f: 'components/dev/hero-dev.tsx', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000', cat: 'DEV', t: 'O Futuro do Desenvolvimento Web' },
  { f: 'components/ia/hero-ia.tsx', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000', cat: 'IA', t: 'Avanços na Inteligência Artificial Generativa' },
  { f: 'components/inovacao/hero-inovacao.tsx', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000', cat: 'INOVAÇÃO', t: 'Tecnologia Sustentável e o Futuro Verde' },
  { f: 'components/startups/hero-startup.tsx', img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=2000', cat: 'STARTUPS', t: 'Rodadas de Investimento Batem Recorde' },
  { f: 'components/trade/hero-trade.tsx', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2000', cat: 'TRADE', t: 'Bolsa de Valores e o Impacto Tech' }
];

fallbacks.forEach(({f, img, cat, t}) => {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    code = code.replace(/image: "\/news-focus\.jpg"/, `image: "${img}"`);
    code = code.replace(/title: "Destaques do dia em atualizacao"/, `title: "${t}"`);
    code = code.replace(/category: "[^"]+"/, `category: "${cat}"`);
    fs.writeFileSync(f, code, 'utf8');
  }
});

console.log("Distinct fallbacks applied");
