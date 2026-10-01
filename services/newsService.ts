
import { NEWS_API_KEY } from "../config/newsConfig";
import { XMLParser } from "fast-xml-parser";

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

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#8217;/gi, "'")
    .replace(/&#8216;/gi, "'")
    .replace(/&#8220;/gi, '"')
    .replace(/&#8221;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&#(?:x?)([0-9a-fA-F]+);/g, (_, hex) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : `&#${hex};`;
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = Number.parseInt(dec, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : `&#${dec};`;
    });
}

export function repairMojibake(text: string): string {
  let repaired = decodeHtmlEntities(text);

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

export interface RssFeedItem {
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
  guid: string;
  thumbnail: string;
  enclosure: { link: string };
}

const rssParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  removeNSPrefix: true,
  trimValues: true,
});

function rssText(value: any): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object" && typeof value["#text"] === "string") return value["#text"];
  return "";
}

function rssItems(value: any): any[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function findRssImage(item: any, description: string, content: string): string {
  const mediaContent = rssItems(item.content).find(entry => entry?.["@_url"]);
  const mediaThumbnail = rssItems(item.thumbnail).find(entry => entry?.["@_url"]);
  const enclosure = rssItems(item.enclosure).find(entry => entry?.["@_url"]);
  const imageTag = `${description} ${content}`.match(/<img[^>]+src=["']([^"']+)["']/i);
  return mediaContent?.["@_url"] || mediaThumbnail?.["@_url"] || enclosure?.["@_url"] || item.image?.url || imageTag?.[1] || "";
}

export async function fetchRssFeed(feedUrl: string): Promise<RssFeedItem[]> {
  const response = await fetch(feedUrl, {
    cache: "no-store",
    headers: { accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9" },
  });
  if (!response.ok) throw new Error(`RSS returned HTTP ${response.status}`);

  const xml = await response.text();
  const parsed = rssParser.parse(xml);
  const channel = parsed.rss?.channel || parsed.feed;
  const rawItems = rssItems(channel?.item || channel?.entry);
  if (rawItems.length === 0) throw new Error("Response did not contain RSS or Atom items");

  return rawItems.map((item): RssFeedItem => {
    const links = rssItems(item.link);
    const alternateLink = links.find(entry => typeof entry === "object" && (!entry["@_rel"] || entry["@_rel"] === "alternate"));
    const link = typeof item.link === "string"
      ? item.link
      : alternateLink?.["@_href"] || rssText(alternateLink) || "";
    const description = rssText(item.description || item.summary);
    const content = rssText(item.encoded || item.content || item["content:encoded"]);
    const image = findRssImage(item, description, content);

    return {
      title: rssText(item.title),
      link,
      description,
      content,
      pubDate: rssText(item.pubDate || item.published || item.updated),
      guid: rssText(item.guid || item.id) || link,
      thumbnail: image,
      enclosure: { link: image },
    };
  }).filter(item => !!item.title && !!item.link);
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

const TITLE_STOP_WORDS = new Set(["a", "ao", "as", "com", "como", "da", "das", "de", "do", "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "para", "por", "que", "um", "uma"]);

function normalizeArticleUrl(value: string): string {
  try {
    const url = new URL(value);
    url.hostname = url.hostname.replace(/^www\./, "").toLowerCase();
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_") || ["fbclid", "gclid"].includes(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.trim().toLowerCase().replace(/[?#].*$/, "").replace(/\/$/, "");
  }
}

function getTitleTokens(title: string): Set<string> {
  return new Set(
    normalizeText(title)
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(token => token.length > 2 && !TITLE_STOP_WORDS.has(token)),
  );
}

export function deduplicateArticles<T extends { id?: string | number; url?: string; title?: string }>(articles: T[]): T[] {
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const seenTitleKeys = new Set<string>();
  const seenTitles: Set<string>[] = [];
  const unique: T[] = [];

  for (const article of articles) {
    const id = article.id === undefined ? "" : String(article.id).trim().toLowerCase();
    const url = article.url ? normalizeArticleUrl(article.url) : "";
    const title = normalizeText(article.title || "").replace(/[^a-z0-9\s]/g, " ").trim().replace(/\s+/g, " ");
    const titleTokens = getTitleTokens(title);
    const duplicateTitle = (title && seenTitleKeys.has(title)) || (titleTokens.size > 0 && seenTitles.some(existing => {
      if (existing.size < 5 || titleTokens.size < 5) return false;
      let shared = 0;
      for (const token of titleTokens) {
        if (existing.has(token)) shared++;
      }
      return shared / Math.max(existing.size, titleTokens.size) >= 0.85;
    }));

    if ((id && seenIds.has(id)) || (url && seenUrls.has(url)) || duplicateTitle) continue;

    if (id) seenIds.add(id);
    if (url) seenUrls.add(url);
    if (title) seenTitleKeys.add(title);
    if (titleTokens.size > 0) seenTitles.push(titleTokens);
    unique.push(article);
  }

  return unique;
}

const MAX_ARTICLE_AGE_MS = 5 * 24 * 60 * 60 * 1000;
const PREVIOUS_DEFAULT_RETENTION_MS = 3 * 24 * 60 * 60 * 1000;

export function isArticleWithinRetention(
  publishedAt: string,
  expiresAt?: string,
  nowTime = Date.now(),
): boolean {
  const publishedTime = new Date(publishedAt).getTime();
  if (!Number.isFinite(publishedTime)) return false;

  const maxAgeExpiry = publishedTime + MAX_ARTICLE_AGE_MS;
  const explicitExpiry = expiresAt ? new Date(expiresAt).getTime() : maxAgeExpiry;
  const wasPreviousDefaultExpiry = explicitExpiry === publishedTime + PREVIOUS_DEFAULT_RETENTION_MS;
  const effectiveExpiry = wasPreviousDefaultExpiry ? maxAgeExpiry : Math.min(maxAgeExpiry, explicitExpiry);
  return effectiveExpiry > nowTime;
}

// 1. Definições de Fontes por Módulo
export const MODULE_SOURCES = {
  Startups: ["startupi", "forbes", "gnews", "startups"],
  Economia: ["infomoney", "g1", "canaltech", "mercado tech", "valor", "globo", "cnn", "gnews"],
  IA: ["canaltech", "techmundo", "noticias ia", "gnews", "forbes"],
  Tecnologia: ["tecnoblog", "noticias tech", "techmundo", "globo", "cnn", "forbes", "gnews"],
  Dev: ["tecnoblog", "noticias tech", "canaltech", "gnews", "diolinux", "forbes", "cnn", "exame", "tabnews"],
  Inovacao: ["globo", "forbes", "g1"],
  Business: ["startupi", "infomoney", "valor", "forbes", "gnews", "cnn"]
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
    "automation ai", "ia generativia"
  ],
  Tecnologia: [
    "software", "hardware", "computacao", "smartphone", "celular", "android", "ios",
    "tecnologia", "processador", "chips", "vazamento", "lancamento", "gadgets", "console",
    "videogame", "playstation", "xbox", "nintendo", "pc", "samsung", "apple", "motorola", "xiaomi",
    "nvidia", "intel", "amd", "ryzen", "gpu", "cpu", "armazenamento", "computador", "internet",
    "internet das coisas", "iot", "rede", "wifi", "bluetooth", "5g", "6g", "tecnologia de ponta",
    "inovacao tecnologica", "realidade virtual", "realidade aumentada", "vr", "ar", "metaverso",
    "blockchain", "criptomoeda", "criptomoedas", "bitcoin", "ethereum", "web3", "segurança digital",
    "cibersegurança", "privacidade", "dados", "cloud computing", "computacao em nuvem", "servidores",
    "google", "microsoft", "amazon", "facebook", "meta", "tiktok", "twitter", "linkedin", "instagram",
    "linux", "distro"
  ],
  Dev: [
    "programacao", "programador", "programadores", "desenvolvedor", "desenvolvedores",
    "desenvolvimento de software", "desenvolvimento web", "engenharia de software", "codigo fonte", "coding",
    "devops", "backend", "frontend", "api", "apis", "framework", "frameworks", "biblioteca de software",
    "javascript", "typescript", "python", "java", "node.js", "react", "angular", "vue", "php", "c++", "c#",
    "docker", "kubernetes", "github", "git", "sql", "nosql", "mongodb", "postgresql", "cloud computing",
    "infraestrutura de software", "cdn", "linux", "distro", "distribuicao linux", "sistema operacional",
    "sistemas operacionais", "postmarketos", "kernel", "open source", "codigo aberto", "software livre",
    "codex", "compilador", "repositorio de codigo", "linguagem de programacao", "linux", "distro"
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
  "futebol", "esportes", "esporte", "goleiro", "goleira", "goleiros", "goleiras", "crimes", "crime", "acidentes", "acidente",
  "fofocas", "fofoca", "novelas", "novela", "celebridades", "celebridade", "famosos",
  "influenciadores", "influenciador", "horoscopo", "loterias", "loteria", "adulto",
  "copa", "copa do mundo", "artilheiro", "gol", "flamengo", "palmeiras", "corinthians",
  "neymar", "mbappe", "messi", "cristiano ronaldo", "atleta", "olimpiadas", "campeonato",
  "torneio", "jogo", "jogos", "nba", "ufc", "boxe", "tenis", "formula 1", "f1",
  "zagueiro", "justica", "judicial", "tribunal", "audiencia", "depoimento", "processo",
  "governo", "candidato", "eleitor", "prefeito", "governador", "presidente", "senador",
  "deputado", "partido", "ministro", "ministerio", "pf", "policia federal", "tse",
  "senado", "congresso", "camara", "parlamento", "guerra", "conflito", "militar", "ataque",
  "ataques", "morte", "mortes", "atentado", "missil", "misseis", "bombardeio", "terrorista",
  "terrorismo", "ira", "jordania", "israel", "gaza", "palestina", "russia", "ucrania", "morto", "mortos",
  "morreu", "morreram", "preso", "presos", "prisao", "prisoes", "custodia", "presidio",
  "policia", "policial", "homicidio", "assassinado", "assassinada", "assassinatos", "tortura", "bet",
  "apostas", "fashion show", "desfile", "moda", "passarela", "trump", "biden", "renan santos", "augusto cury", "ciro gomes",
  "flavio bolsonaro", "zema", "capitao wagner", "eduardo bolsonaro", "eleição", "eleições", "haddad", "qaest", "tarot",
  "alexandre de moraes", "xandao", "moraes"
];

const DEV_PROHIBITED_TERMS = ["gta", "rockstar", "videogame", "videogames", "gameplay"];
const ENTERTAINMENT_TERMS = [
  "filme", "filmes", "cinema", "game of thrones", "aegon", "targaryen", "hbo",
  "ator", "atores", "atriz", "atrizes", "elenco", "trailer", "longa-metragem",
  "futebol", "esporte", "esportes", "zagueiro", "time", "campeonato", "torneio",
  "justica", "judicial", "tribunal", "audiencia", "depoimento", "processo"
];
const ENTERTAINMENT_URL_SECTIONS = ["/pop/", "/cinema/", "/entretenimento/", "/celebridades/", "/filmes/", "/series/", "/esportes/", "/futebol/", "/esporte/"];
const TECH_CONTEXT_TERMS = [
  "software", "hardware", "computacao", "smartphone", "celular", "android", "ios",
  "processador", "chip", "gpu", "cpu", "algoritmo", "api", "app", "aplicativo",
  "cloud", "data center", "servidor", "servidores", "ia", "inteligencia artificial",
  "machine learning", "computador", "rede", "wifi", "bluetooth", "iot", "sensor",
  "seguranca digital", "cyberseguranca", "programacao", "codigo",
  "sistema operacional", "software livre", "framework"
];
const NON_TECH_DOMAIN_TERMS = [
  "boi", "bois", "gado", "galinha", "galinhas", "pecuaria", "agro", "agricultura",
  "eleicao", "eleições", "politica", "governo", "partido", "senador", "prefeito",
  "saude", "medicina", "hospital", "educacao", "escola", "futebol", "esporte",
  "cinema", "filme", "celebridade", "moda", "jogo", "jogos", "estupro", "estupros",
  "violencia", "crime", "crimes", "homicidio", "assassinato", "seguranca publica",
  "segurança pública", "ocorrencia", "ocorrências", "ssp", "policia", "batalhao", "detento",
  "hospitalar", "vítima", "vitima", "justica", "audiencia", "depoimento",
  "idoso", "idosos", "envelhecer", "qualidade de vida", "aposentadoria", "aposentado"
];
const PUBLIC_SAFETY_REJECTION_TERMS = [
  "estupro", "estupros", "violencia", "crime", "crimes", "homicidio", "assassinato",
  "seguranca publica", "segurança pública", "ocorrencia", "ocorrencias", "policia", "ssp",
  "vítima", "vitima", "justica", "tribunal", "audiencia", "depoimento"
];
const LEGAL_AND_POLITICAL_REJECTION_TERMS = [
  "moraes", "advogado", "reu", "réu", "peticao", "petição", "stf", "suprema corte",
  "tribunal", "justica", "processo", "acao judicial", "ação judicial", "pedido judicial",
  "ministerio", "governo", "política", "politica", "candidato", "eleicao", "eleições"
];
const INNOVATION_CONTEXT_TERMS = [
  "pesquisa", "cientifico", "científica", "tecnologia", "software", "hardware", "ia",
  "inteligencia artificial", "algoritmo", "computacao", "dados", "ciencia", "inovacao",
  "biotecnologia", "engenharia", "sistema", "inteligente", "sensor", "automacao"
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

export function isEntertainmentArticle(title: string, description: string, url = ""): boolean {
  if (countMatches(`${title} ${description}`, ENTERTAINMENT_TERMS) > 0) return true;
  const normalizedUrl = normalizeText(url).toLowerCase();
  return ENTERTAINMENT_URL_SECTIONS.some(section => normalizedUrl.includes(section));
}

export function hasCategoryEvidence(title: string, description: string, category: string, url = ""): boolean {
  const keywords = MODULE_KEYWORDS[category as keyof typeof MODULE_KEYWORDS];
  if (!keywords) return false;
  if (isEntertainmentArticle(title, description, url)) return false;
  const text = `${title} ${description}`;
  if (category === "Dev" && countMatches(text, DEV_PROHIBITED_TERMS) > 0) return false;
  if (category === "Tecnologia") {
    const hasNonTechContext = countMatches(text, NON_TECH_DOMAIN_TERMS) > 0;
    const hasTechContext = countMatches(text, TECH_CONTEXT_TERMS) > 0;
    const hasPublicSafetySignal = countMatches(text, PUBLIC_SAFETY_REJECTION_TERMS) > 0;
    if (hasPublicSafetySignal && !hasTechContext) return false;
    if (hasNonTechContext && !hasTechContext) return false;
  }

  if (category === "Inovacao") {
    const hasNonTechContext = countMatches(text, NON_TECH_DOMAIN_TERMS) > 0;
    const hasInnovationContext = countMatches(text, INNOVATION_CONTEXT_TERMS) > 0;
    if (hasNonTechContext && !hasInnovationContext) return false;
  }

  if (category === "IA") {
    const hasLegalOrPoliticalSignal = countMatches(text, LEGAL_AND_POLITICAL_REJECTION_TERMS) > 0;
    const hasTechContext = countMatches(text, TECH_CONTEXT_TERMS) > 0;
    if (hasLegalOrPoliticalSignal && !hasTechContext) return false;
  }

  return countMatches(text, keywords) > 0;
}

export function isEnglishDevSource(source: string): boolean {
  const normalizedSource = normalizeText(source).replace(/[^a-z0-9]+/g, "");
  return ["github", "stackoverflow", "infoq", "devto"].some(name => normalizedSource.includes(name));
}

export function isCategorySpecificRssFeed(feedUrl: string, category: string): boolean {
  const normalizedUrl = normalizeText(feedUrl).toLowerCase();
  if (category === "IA") {
    return normalizedUrl.includes("/noticias-sobre/inteligencia-artificial/feed") ||
      normalizedUrl.includes("/tudo-sobre/inteligencia-artificial/feed");
  }
  if (category === "Dev") {
    return normalizedUrl.includes("/noticias-sobre/desenvolvimento-de-software/feed") ||
      normalizedUrl.includes("tabnews.com.br/rss");
  }
  return false;
}

// Calcula score e determina melhor categoria com base nas regras do MetaPrompt
function classifyArticleBySourceAndKeywords(title: string, description: string, source: string): { category: string; score: number } {
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

export function classifyArticle(title: string, description: string, source: string, url = ""): { category: string; score: number } {
  if (isEntertainmentArticle(title, description, url)) return { category: "Rejeitado", score: 0 };
  const classification = classifyArticleBySourceAndKeywords(title, description, source);
  if (classification.category === "Rejeitado") return classification;

  if (!hasCategoryEvidence(title, description, classification.category, url)) {
    return { category: "Rejeitado", score: 0 };
  }

  return classification;
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
            if (seenUrls.has(item.url)) continue;

            const sourceName = typeof item.source === 'object' ? item.source.name : item.source;
            const title = repairMojibake(item.title || "");
            const description = repairMojibake(item.description || "");
            
            // Validação 1: Origem Válida
            if (!isSourceAllowed(sourceName, targetCategory)) continue;

            // Validação 2: Classificação e Score Semântico
            const classification = classifyArticle(title, description, sourceName, item.url);
            let articleCategory = classification.category;
            if (targetCategory === "Startups" && sourceName.toLowerCase().includes("startupi") && (articleCategory === "Startups" || articleCategory === "Business")) {
              articleCategory = "Startups";
            }
            if (articleCategory !== targetCategory || !hasCategoryEvidence(title, description, articleCategory)) continue;

            seenUrls.add(item.url);
            approvedArticles.push({
              id: item.url,
              title,
              description,
              url: item.url,
              image: item.image || "/news-focus.jpg",
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
      
      let feedUrls = ['https://tecnoblog.net/feed/', 'https://g1.globo.com/rss/g1/tecnologia/', 'https://canaltech.com.br/rss/'];
      if (targetCategory === "Startups") {
        feedUrls = ['https://startupi.com.br/feed/', 'https://startups.com.br/feed/', 'https://forbes.com.br/noticias-sobre/startups/feed/'];
      } else if (targetCategory === "Economia") {
        feedUrls = ['https://www.infomoney.com.br/feed/', 'https://startupi.com.br/feed/', 'https://valor.globo.com/rss/valor/', 'https://g1.globo.com/economia/rss2.0.xml', 'https://www1.folha.uol.com.br/mercado/rss2.0.xml'];
      } else if (targetCategory === "Business") {
        feedUrls = ['https://startupi.com.br/feed/', 'https://www.infomoney.com.br/feed/', 'https://www.cnnbrasil.com.br/ia/feed/'];
      } else if (targetCategory === "IA") {
        feedUrls = ['https://canaltech.com.br/rss/', 'https://startupi.com.br/feed/', 'https://www.cnnbrasil.com.br/tudo-sobre/inteligencia-artificial/feed/', 'https://forbes.com.br/noticias-sobre/inteligencia-artificial/feed/'];
      } else if (targetCategory === "Dev") {
        feedUrls = ['https://diolinux.com.br/feed', 'https://forbes.com.br/noticias-sobre/desenvolvimento-de-software/feed/', 'https://tecnoblog.net/feed/', 'https://rss.tecmundo.com.br/feed', 'https://canaltech.com.br/rss/', 'https://www.tabnews.com.br/rss'];
      } else if (targetCategory === "Inovacao") {
        feedUrls = ['https://g1.globo.com/rss/g1/inovacao/', 'https://forbes.com.br/noticias-sobre/inovacao/feed/'];
      }

      const allItems: any[] = [];
      
      // Busca concorrente nos feeds configurados
      await Promise.all(feedUrls.map(async (feedUrl) => {
        try {
          const items = await fetchRssFeed(feedUrl);
          allItems.push(...items.map(item => ({ ...item, originFeedUrl: feedUrl })));
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
        } else if (item.originFeedUrl.includes("tabnews.com.br")) {
          feedSource = "TabNews";
        }

            const classification = classifyArticle(title, cleanDesc, feedSource, item.link);

        // Validação 2 no Fallback RSS
        let articleCategory = classification.category;
        if (targetCategory === "Startups" && feedSource.toLowerCase().includes("startupi") && (articleCategory === "Startups" || articleCategory === "Business")) {
          articleCategory = "Startups";
        }
        if (targetCategory === "Inovacao") {
          articleCategory = "Inovacao"; // Forcefully allow these specific feeds
        }
        if (isCategorySpecificRssFeed(item.originFeedUrl, targetCategory)) {
          articleCategory = targetCategory;
        }
        if (articleCategory !== targetCategory || !hasCategoryEvidence(title, cleanDesc, articleCategory)) continue;

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
  const recentUniqueArticles = deduplicateArticles(approvedArticles)
    .filter(article => isArticleWithinRetention(article.publishedAt));
  return balanceArticlesBySource(recentUniqueArticles).slice(offset, offset + max);
}
