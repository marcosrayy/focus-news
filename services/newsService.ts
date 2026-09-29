
import { NEWS_API_KEY } from "../config/newsConfig";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: string;
  category?: string;
  score?: number;
}

const WINDOWS_1252_BYTES = new Map<number, number>([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);

export function repairMojibake(text: string): string {
  let repaired = text;

  for (let pass = 0; pass < 3; pass++) {
    const characters = Array.from(repaired);
    let next = "";
    let changed = false;

    for (let index = 0; index < characters.length; index++) {
      const firstCodePoint = characters[index].codePointAt(0)!;
      const firstByte = firstCodePoint <= 0xff ? firstCodePoint : WINDOWS_1252_BYTES.get(firstCodePoint);
      const sequenceLength = firstByte !== undefined && firstByte >= 0xc2 && firstByte <= 0xdf
        ? 2
        : firstByte !== undefined && firstByte >= 0xe0 && firstByte <= 0xef
          ? 3
          : firstByte !== undefined && firstByte >= 0xf0 && firstByte <= 0xf4
            ? 4
            : 0;

      if (!sequenceLength || index + sequenceLength > characters.length) {
        next += characters[index];
        continue;
      }

      const bytes = [firstByte!];
      for (let offset = 1; offset < sequenceLength; offset++) {
        const codePoint = characters[index + offset].codePointAt(0)!;
        const byte = codePoint <= 0xff ? codePoint : WINDOWS_1252_BYTES.get(codePoint);
        if (byte === undefined || byte < 0x80 || byte > 0xbf) break;
        bytes.push(byte);
      }

      if (bytes.length !== sequenceLength) {
        next += characters[index];
        continue;
      }

      try {
        next += new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
        index += sequenceLength - 1;
        changed = true;
      } catch {
        next += characters[index];
      }
    }

    if (!changed) break;
    repaired = next;
  }

  return repaired.normalize("NFC");
}

export function balanceArticlesBySource<T extends { source?: string | null }>(articles: T[]): T[] {
  const sources = new Map<string, T[]>();

  for (const article of articles) {
    const source = article.source?.trim().toLowerCase() || "unknown";
    const sourceArticles = sources.get(source) || [];
    sourceArticles.push(article);
    sources.set(source, sourceArticles);
  }

  const positions = new Map<string, number>();
  const balanced: T[] = [];
  let hasMoreArticles = true;

  while (hasMoreArticles) {
    hasMoreArticles = false;

    for (const [source, sourceArticles] of sources) {
      const position = positions.get(source) || 0;
      if (position >= sourceArticles.length) continue;

      balanced.push(sourceArticles[position]);
      positions.set(source, position + 1);
      hasMoreArticles = true;
    }
  }

  return balanced;
}

// 1. Definições de Fontes por Módulo
export const MODULE_SOURCES = {
  Startups: ["startupi", "forbes", "gnews"],
  Economia: ["infomoney", "canaltech", "mercado tech", "valor", "globo", "cnn", "gnews"],
  IA: ["canaltech", "techmundo", "noticias ia", "gnews"],
  Tecnologia: ["tecnoblog", "noticias tech", "techmundo", "globo", "cnn", "forbes", "gnews"],
  Dev: ["tecnoblog", "noticias tech", "canaltech", "gnews", "diolinux", "forbes"],
  Inovacao: ["globo", "forbes"],
  Business: ["startupi", "infomoney", "valor", "forbes", "gnews"]
};

// 2. Palavras-chave Permitidas por Módulo (para cálculo de Score)
const MODULE_KEYWORDS = {
  Startups: [
    "startup", "startups", "empreendedorismo", "empreendedor", "venture capital",
    "aceleracao", "incubadora", "founder", "founders", "negocios digitais",
    "saas", "unicornio", "unicornios", "ecossistema", "fintech", "fintechs",
    "rodada de investimento", "rodadas de investimento", "aporte", "innovation hub"
  ],
  Economia: [
    "economia", "mercado financeiro", "empresas", "investimentos", "bolsa de valores", "mercado de capitais", "financas pessoais", "gestao financeira",
    "negocios", "macroeconomia", "fintechs", "empresas brasileiras", "resultados financeiros", "bolsa",
    "inflacao", "juros", "acoes", "financas", "pib", "receita", "lucro", "selic", "cambio", "dolar",
    "acordo", "compra", "venda", "fusao", "aquisicao", "banco", "bancos", "financeiro", "financeira",
    "empresa", "bilhoes", "milhoes", "bilhao", "milhao", "reais", "dolares", "euro", "mercado",
    "investir", "investimento", "investidor", "investidores", "acao", "lucros", "prejuizo", "faturamento"
  ],
  IA: [
    "ia", "artificial intelligence", "inteligencia artificial", "chatgpt", "openai",
    "anthropic", "google ai", "gemini", "claude", "llms", "llm", "machine learning",
    "deep learning", "ia generativa", "robotica", "automacao inteligente", "copilot",
    "automation ai"
  ],
  Tecnologia: [
    "software", "hardware", "computacao", "smartphone", "celular", "android", "ios",
    "tecnologia", "processador", "chips", "vazamento", "lancamento", "gadgets", "console",
    "videogame", "playstation", "xbox", "nintendo", "pc", "samsung", "apple", "motorola", "xiaomi"
  ],
  Dev: [
    "desenvolvimento", "programacao", "cloud", "infraestrutura", "apis", "api",
    "seguranca", "devops", "frameworks", "framework", "bancos de dados", "javascript",
    "python", "java", "node", "react", "aws", "azure", "gcp", "docker", "kubernetes",
    "linux", "github", "backend", "frontend", "git", "codigo", "coding", "software",
    "programador", "desenvolvedor"
  ],
  Inovacao: [
    "inovacao", "pesquisa", "patente", "descoberta", "ciencia", "cientifico",
    "cientistas", "vacina", "espacial", "nasa", "astronomia", "planeta", "energia limpa",
    "energia sustentavel", "biotecnologia", "medicina", "cura", "saude", "avanco",
    "futuro","genetica", "quantum", "computacao quantica", "invenção",
    "descobertas", "tecnologica", "transformacao digital"
  ],
  Business: [
    "empreendedorismo", "empreendedor", "empreendedora", "negocios", "negocio",
    "gestao", "lideranca", "ceo", "cto", "cfo", "c-level", "empresa", "empresas",
    "crescimento", "escala", "escalabilidade", "receita", "faturamento", "plg",
    "product led growth", "modelo de negocio", "saas", "b2b", "b2c",
    "cultura organizacional", "trabalho remoto", "hibrido", "produtividade",
    "ipo", "abertura de capital", "expansao", "mercado", "cases",
    "inovacao corporativa", "transformacao digital", "franquia", "franquias",
    "varejo", "e-commerce", "marketplace"
  ]
};

// 3. Proibições Absolutas (Mata-mata - Score vira 0 imediatamente)
const PROHIBITED_TERMS = [
  "politica", "eleicoes", "lula", "bolsonaro", "stf", "bbb", "reality show", "reality",
  "futebol", "esportes", "esporte", "crimes", "crime", "acidentes", "acidente",
  "fofocas", "fofoca", "novelas", "novela", "celebridades", "celebridade", "famosos",
  "influenciadores", "influenciador", "horoscopo", "loterias", "loteria", "adulto",
  "copa", "copa do mundo", "artilheiro", "gol", "flamengo", "palmeiras", "corinthians",
  "neymar", "mbappe", "messi", "cristiano ronaldo", "atleta", "olimpiadas", "campeonato",
  "torneio", "jogo", "jogos", "nba", "ufc", "boxe", "tenis", "formula 1", "f1",
  "governo", "candidato", "eleitor", "prefeito", "governador", "presidente", "senador",
  "deputado", "partido", "ministro", "ministerio", "pf", "policia federal", "tse",
  "senado", "congresso", "camara", "parlamento", "guerra", "conflito", "militar", "ataque",
  "ataques", "morte", "mortes", "atentado", "missil", "misseis", "bombardeio", "terrorista",
  "terrorismo", "ira", "jordania", "israel", "gaza", "palestina", "russia", "ucrania",
  "morreu", "morreram", "preso", "presos", "prisao", "prisoes", "custodia", "presidio",
  "policia", "policial", "homicidio", "assassinado", "assassinada", "assassinatos", "tortura", "bet",
  "apostas", "trump", "biden", "renan santos", "augusto cury", "ciro gomes"
];

// Helper para normalizar strings (remove acentos e caixa alta)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Helper para contar ocorrências exatas de palavras-chave no texto
function countMatches(text: string, keywords: string[]): number {
  let count = 0;
  const normText = normalizeText(text);

  for (const kw of keywords) {
    const kwNorm = normalizeText(kw);
    const escaped = kwNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Se o termo tem espaço, busca literal, senão busca palavra inteira com limite de borda
    const regex = kwNorm.includes(' ')
      ? new RegExp(escaped, 'g')
      : new RegExp('\\b' + escaped + '\\b', 'g');
      
    const matches = normText.match(regex);
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}

// Calcula score e determina melhor categoria com base nas regras do MetaPrompt
export function classifyArticle(title: string, description: string, source: string): { category: string; score: number } {
  const fullText = `${title} ${description}`;
  const normText = normalizeText(fullText);
  const normSource = normalizeText(source);

  // Regra Mata-mata (Proibições)
  const hasProhibited = PROHIBITED_TERMS.some(term => {
    const termNorm = normalizeText(term);
    const regex = new RegExp('\\b' + termNorm + '\\b', 'i');
    return regex.test(normText);
  });

  if (hasProhibited) {
    return { category: "Rejeitado", score: 0 };
  }

  // PASSO 1: Identificar a origem para definir a categoria permitida diretamente (Fontes Estritas)
  if (normSource.includes("startupi")) {
    // Classificar IA somente se palavras-chave de IA dominam claramente sobre Business
    const iaMatches = countMatches(fullText, MODULE_KEYWORDS.IA);
    const bizTotal = countMatches(fullText, MODULE_KEYWORDS.Business);
    if (iaMatches > 0 && iaMatches > bizTotal) {
      return { category: "IA", score: 100 };
    }
    const isFintech = ["fintech", "financeira", "banco digital", "pagamento digital", "credito digital"].some(w => normText.includes(w));
    if (isFintech) {
      return { category: "Economia", score: 100 };
    }
    // Startupi é naturalmente sobre empreendedorismo — classifica como Startups OU Business
    // Somente artigos com termos explícitos de VC/funding/rodadas vão para Startups
    const startupMatches = countMatches(fullText, ["venture capital", "rodada de investimento", "aporte", "seed", "serie a", "serie b", "unicornio", "incubadora", "aceleradora"]);
    if (startupMatches > 0) {
      return { category: "Startups", score: 100 };
    }
    return { category: "Business", score: 100 };
  }
  
  if (normSource.includes("infomoney") || normSource.includes("mercado tech") || normSource.includes("valor")) {
    // InfoMoney/Valor com keywords de Business
    const bizMatches = countMatches(fullText, MODULE_KEYWORDS.Business);
    const econMatches = countMatches(fullText, MODULE_KEYWORDS.Economia);
    if (bizMatches > econMatches) {
      return { category: "Business", score: 100 };
    }
    return { category: "Economia", score: 100 };
  }

  // Tecnoblog e Notícias Tech podem ter classificação entre Tecnologia e Dev
  const isTechSource = normSource.includes("tecnoblog") || normSource.includes("noticias tech");
  if (isTechSource) {
    const devMatches = countMatches(fullText, MODULE_KEYWORDS.Dev);
    const techMatches = countMatches(fullText, MODULE_KEYWORDS.Tecnologia);
    const total = devMatches + techMatches;

    if (total === 0) {
      return { category: "Tecnologia", score: 100 }; // Fallback seguro
    }

    const devScore = (devMatches / total) * 100;
    if (devScore >= 70) {
      return { category: "Dev", score: Math.round(devScore) };
    }
    return { category: "Tecnologia", score: 100 };
  }

  // Se a fonte for Diolinux, classifica diretamente como Dev
  if (normSource.includes("diolinux")) {
    return { category: "Dev", score: 100 };
  }

  // Para fontes híbridas e gerais (Canaltech, TechMundo, Gizmodo, Globo, CNN, Forbes, GNews, etc.)
  const isHybrid = ["canaltech", "techmundo", "noticias ia", "gizmodo", "startupi", "globo", "cnn", "forbes", "gnews"].some(src => normSource.includes(src));
  if (isHybrid) {
    const iaMatches = countMatches(fullText, MODULE_KEYWORDS.IA);
    const tecnologiaMatches = countMatches(fullText, MODULE_KEYWORDS.Tecnologia);
    const devMatches = countMatches(fullText, MODULE_KEYWORDS.Dev);
    const inovacaoMatches = countMatches(fullText, MODULE_KEYWORDS.Inovacao);
    const startupsMatches = countMatches(fullText, MODULE_KEYWORDS.Startups);
    const economiaMatches = countMatches(fullText, MODULE_KEYWORDS.Economia);
    const businessMatches = countMatches(fullText, MODULE_KEYWORDS.Business);
    
    const total = iaMatches + tecnologiaMatches + devMatches + inovacaoMatches + startupsMatches + economiaMatches + businessMatches;

    if (total === 0) {
      return { category: "Rejeitado", score: 0 };
    }

    const iaScore = (iaMatches / total) * 100;
    const techScore = (tecnologiaMatches / total) * 100;
    const devScore = (devMatches / total) * 100;
    const inovacaoScore = (inovacaoMatches / total) * 100;
    const startupsScore = (startupsMatches / total) * 100;
    const economiaScore = (economiaMatches / total) * 100;
    const businessScore = (businessMatches / total) * 100;

    const maxScore = Math.max(iaScore, techScore, devScore, inovacaoScore, startupsScore, economiaScore, businessScore);
    
    if (maxScore === iaScore && iaScore >= 80) {
      return { category: "IA", score: Math.round(iaScore) };
    } else if (maxScore === devScore && devScore >= 80) {
      return { category: "Dev", score: Math.round(devScore) };
    } else if (maxScore === inovacaoScore && inovacaoScore >= 80) {
      return { category: "Inovacao", score: Math.round(inovacaoScore) };
    } else if (maxScore === startupsScore && startupsScore >= 75) {
      return { category: "Startups", score: Math.round(startupsScore) };
    } else if (maxScore === economiaScore && economiaScore >= 75) {
      return { category: "Economia", score: Math.round(economiaScore) };
    } else if (maxScore === businessScore && businessScore >= 75) {
      return { category: "Business", score: Math.round(businessScore) };
    } else if (techScore >= 75) {
      return { category: "Tecnologia", score: Math.round(techScore) };
    }
  }

  return { category: "Rejeitado", score: 0 };
}

// Verifica se a fonte do artigo é permitida para o módulo solicitado
export function isSourceAllowed(source: string, targetCategory: string): boolean {
  const normSource = normalizeText(source);
  if (normSource.includes("gnews")) return true;
  
  const allAllowed = [
    ...MODULE_SOURCES.Startups,
    ...MODULE_SOURCES.Economia,
    ...MODULE_SOURCES.IA,
    ...MODULE_SOURCES.Tecnologia,
    ...MODULE_SOURCES.Dev,
    ...MODULE_SOURCES.Inovacao,
    ...MODULE_SOURCES.Business,
    "diolinux",
    "globo",
    "cnn",
    "forbes",
    "techmundo"
  ];

  // Verifica se o canal está na lista geral de origens válidas do portal
  return allAllowed.some(src => normSource.includes(src));
}

export async function fetchNewsBackend({
  query,
  category = "Geral",
  max = 6,
  offset = 0,
}: {
  query?: string;
  category?: string;
  max?: number;
  offset?: number;
}): Promise<NewsArticle[]> {
  let approvedArticles: NewsArticle[] = [];
  
  // Mapeamento de categorias virtuais para categorias físicas do MetaPrompt
  let targetCategory = category;
  if (category === "Geral" || category === "Destaques") {
    targetCategory = "Tecnologia";
  } else if (category === "Trade") {
    targetCategory = "Economia";
  } else if (category === "Business") {
    targetCategory = "Business";
  } else if (category === "Inovacao") {
    targetCategory = "Inovacao";
  } else if (category === "Dev") {
    targetCategory = "Dev";
  }

  // Cache temporário em memória para evitar duplicação nesta execução
  const seenUrls = new Set<string>();

  try {
    // API GNEWS como Fonte Primária
    if (targetCategory !== "Inovacao") {
      const searchQuery = query || "tecnologia OR startups OR economia OR inteligência artificial";
      const apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=pt&max=${(max + offset) * 2}&apikey=${NEWS_API_KEY}`;
      
      const res = await fetch(apiUrl, { cache: "force-cache" });
      if (res.ok) {
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles)) {
          for (const item of data.articles) {
            if (!item.image || seenUrls.has(item.url)) continue;

            const sourceName = typeof item.source === 'object' ? item.source.name : item.source;
            const title = repairMojibake(item.title || "");
            const description = repairMojibake(item.description || "");
            
            // Validação 1: Origem Válida
            if (!isSourceAllowed(sourceName, targetCategory)) continue;

            // Validação 2: Classificação e Score Semântico
            const classification = classifyArticle(title, description, sourceName);
            let articleCategory = classification.category;
            if (targetCategory === "Startups" && sourceName.toLowerCase().includes("startupi") && (articleCategory === "Startups" || articleCategory === "Business")) {
              articleCategory = "Startups";
            }
            if (articleCategory !== targetCategory) continue;

            seenUrls.add(item.url);
            approvedArticles.push({
              id: item.url,
              title,
              description,
              url: item.url,
              image: item.image,
              publishedAt: item.publishedAt,
              source: sourceName,
              category: targetCategory,
              score: classification.score
            });

          }
        }
      }
    }
  } catch (error) {
    console.warn(`[GNews API] Fetch failed. Error:`, error);
  }

  // Se não obteve artigos suficientes do GNews, recorre ao Fallback RSS
  const minimumSourceCount = Math.min(3, max + offset);
  const gnewsSourceCount = new Set(approvedArticles.map(article => article.source.trim().toLowerCase())).size;
  if (approvedArticles.length < max + offset || gnewsSourceCount < minimumSourceCount) {
    try {
      console.warn(`[FocusNews] GNews returned insufficient results. Using RSS Fallback for ${targetCategory}...`);
      
      let feedUrls = ['https://tecnoblog.net/feed/', 'https://g1.globo.com/tecnologia/rss2.0.xml', 'https://canaltech.com.br/feed/'];
      if (targetCategory === "Startups") {
        feedUrls = ['https://startupi.com.br/feed/'];
      } else if (targetCategory === "Economia" || targetCategory === "Trade") {
        feedUrls = ['https://www.infomoney.com.br/feed/', 'https://startupi.com.br/feed/', 'https://valor.globo.com/rss/valor/', 'https://g1.globo.com/economia/rss2.0.xml'];
      } else if (targetCategory === "Business") {
        feedUrls = ['https://startupi.com.br/feed/', 'https://www.infomoney.com.br/feed/', 'https://www.cnnbrasil.com.br/ia/feed/'];
      } else if (targetCategory === "IA") {
        feedUrls = ['https://canaltech.com.br/rss/', 'https://startupi.com.br/feed/'];
      } else if (targetCategory === "Dev") {
        feedUrls = ['https://diolinux.com.br/feed', 'https://forbes.com.br/noticias-sobre/desenvolvimento-de-software/feed/'];
      } else if (targetCategory === "Inovacao") {
        feedUrls = ['https://g1.globo.com/rss/g1/inovacao/', 'https://forbes.com.br/noticias-sobre/inovacao/feed/'];
      }

      const allItems: any[] = [];
      
      // Busca concorrente nos feeds configurados
      await Promise.all(feedUrls.map(async (feedUrl) => {
        try {
          const rssApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
          const rssRes = await fetch(rssApiUrl, { cache: "force-cache" });
          if (rssRes.ok) {
            const rssData = await rssRes.json();
            if (rssData.items && Array.isArray(rssData.items)) {
              allItems.push(...rssData.items.map((item: any) => ({
                ...item,
                originFeedUrl: feedUrl
              })));
            }
          }
        } catch (err) {
          console.warn(`[FocusNews] Failed to fetch feed ${feedUrl}:`, err);
        }
      }));

      // Ordena por data (mais recentes primeiro)
      allItems.sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime());

      for (const item of allItems) {
        if (seenUrls.has(item.link)) continue;

        let imageUrl = item.enclosure?.link || item.thumbnail;
        if (!imageUrl && item.description) {
          const match = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (match) imageUrl = match[1];
        }
        if (!imageUrl && item.content) {
          const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (match) imageUrl = match[1];
        }

        const title = repairMojibake(item.title || "");
        const cleanDesc = repairMojibake((item.description || "").replace(/<[^>]+>/g, '')).slice(0, 150) + '...';
        
        // Mapeia origem correta para classificação
        let feedSource = "Tecnoblog";
        if (item.originFeedUrl.includes("startupi")) {
          feedSource = "Startupi";
        } else if (item.originFeedUrl.includes("infomoney")) {
          feedSource = "InfoMoney";
        } else if (item.originFeedUrl.includes("canaltech")) {
          feedSource = "Canaltech";
        } else if (item.originFeedUrl.includes("diolinux")) {
          feedSource = "Diolinux";
        } else if (item.originFeedUrl.includes("gizmodo")) {
          feedSource = "Gizmodo";
        } else if (item.originFeedUrl.includes("valor")) {
          feedSource = "Valor";
        } else if (item.originFeedUrl.includes("globo")) {
          feedSource = "G1";
        } else if (item.originFeedUrl.includes("forbes")) {
          feedSource = "Forbes";
        } else if (item.originFeedUrl.includes("cnnbrasil")) {
          feedSource = "CNN Brasil";
        }

        const classification = classifyArticle(title, cleanDesc, feedSource);

        // Validação 2 no Fallback RSS
        let articleCategory = classification.category;
        if (targetCategory === "Startups" && feedSource.toLowerCase().includes("startupi") && (articleCategory === "Startups" || articleCategory === "Business")) {
          articleCategory = "Startups";
        }
        if (targetCategory === "Inovacao") {
          articleCategory = "Inovacao"; // Forcefully allow these specific feeds
        }
        if (articleCategory !== targetCategory) continue;

        seenUrls.add(item.link);
        approvedArticles.push({
          id: item.guid || item.link,
          title,
          description: cleanDesc,
          url: item.link,
          image: imageUrl || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000",
          publishedAt: item.pubDate,
          source: feedSource,
          category: targetCategory,
          score: classification.score
        });

      }
    } catch (e) {
      console.error("[FocusNews] RSS Fallback failed:", e);
    }
  }

  approvedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return balanceArticlesBySource(approvedArticles).slice(offset, offset + max);
}
