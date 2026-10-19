import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const NEWS_COVER_POOL = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200'
]

export function getDistinctCover(seed: string, offset = 0) {
  const normalizedSeed = seed.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'news';
  let hash = 0;

  for (const char of normalizedSeed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return NEWS_COVER_POOL[(hash + offset) % NEWS_COVER_POOL.length];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCoverByIndex(index: number): string {
  const safeIndex =
    ((index % NEWS_COVER_POOL.length) + NEWS_COVER_POOL.length) %
    NEWS_COVER_POOL.length;

  return NEWS_COVER_POOL[safeIndex];
}

/* -------------------------------------------------------------------------- */
/*  Capas: atribuição única por categoria                                      */
/* -------------------------------------------------------------------------- */

/** Hash FNV-1a: distribui bem mesmo para strings parecidas (títulos de notícias). */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(hash ^ value.charCodeAt(i), 16777619) >>> 0;
  }
  return hash;
}

/** Identifica a "foto" ignorando query string (?w=, ?q=...) e hash. */
export function coverKey(url: string): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    return (u.origin + u.pathname).toLowerCase();
  } catch {
    return url.split("?")[0].trim().toLowerCase();
  }
}

/**
 * Capa gerada (SVG em data URI): única por seed, nunca repete e não depende de rede.
 * Usada quando a notícia não tem imagem e o pool de fotos já foi todo usado.
 */
export function getGeneratedCover(seed: string, label = "NEWS"): string {
  const h = hashString(seed);
  const hue = h % 360;
  const hue2 = (hue + 40 + (h % 50)) % 360;
  const rotate = h % 360;
  const safeLabel = label.replace(/[^\p{L}\p{N} ]/gu, "").toUpperCase().slice(0, 18);

  const circles = [0, 1, 2]
    .map((i) => {
      const r = hashString(`${seed}-${i}`);
      const cx = r % 1200;
      const cy = (r >>> 8) % 750;
      const rad = 120 + ((r >>> 16) % 260);
      return `<circle cx='${cx}' cy='${cy}' r='${rad}'/>`;
    })
    .join("");

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 750'>` +
    `<defs><linearGradient id='g' gradientTransform='rotate(${rotate} .5 .5)'>` +
    `<stop offset='0' stop-color='hsl(${hue} 65% 32%)'/>` +
    `<stop offset='1' stop-color='hsl(${hue2} 70% 13%)'/></linearGradient></defs>` +
    `<rect width='1200' height='750' fill='url(#g)'/>` +
    `<g fill='none' stroke='white' stroke-opacity='.10' stroke-width='3'>${circles}</g>` +
    `<text x='64' y='690' font-family='monospace' font-size='54' letter-spacing='10' ` +
    `fill='white' fill-opacity='.35'>${safeLabel}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

type CoverArticle = {
  id?: string | number;
  title: string;
  image?: string | null;
  category?: string | number;
};

// Mantém a mesma capa para a mesma notícia entre atualizações (evita "piscar" a cada refresh).
const coverCache = new Map<string, string>();

/**
 * Atribui capas para TODA a lista de uma categoria de uma vez, sem repetir nenhuma.
 *
 * Ordem de prioridade:
 *  1. imagem real da notícia (a primeira que usar cada URL ganha; repetidas são tratadas como ausentes)
 *  2. foto do NEWS_COVER_POOL ainda não usada, começando num ponto derivado da categoria + título
 *     (assim "DEV" e "IA" não começam sempre pelas mesmas fotos)
 *  3. capa gerada (SVG único)
 *
 * Chame uma única vez por categoria (no hook/provider do feed) e passe o resultado adiante.
 */
export function assignCovers<T extends CoverArticle>(articles: T[], scope: string): T[] {
  const used = new Set<string>();
  const realImages = new Map<number, string>();

  // 1ª passada: reserva as imagens reais únicas para que os genéricos não "roubem" a vez delas.
  articles.forEach((article, index) => {
    const image = article.image?.trim() ?? "";
    const key = coverKey(image);
    if (key && !used.has(key)) {
      used.add(key);
      realImages.set(index, image);
    }
  });

  return articles.map((article, index) => {
    const real = realImages.get(index);
    if (real) return { ...article, image: real };

    const id = String(article.id ?? article.title);
    const cacheKey = `${scope}:${id}`;

    const cached = coverCache.get(cacheKey);
    if (cached && !used.has(coverKey(cached))) {
      used.add(coverKey(cached));
      return { ...article, image: cached };
    }

    const start = hashString(`${scope}:${article.title}`) % NEWS_COVER_POOL.length;
    let chosen = "";
    for (let offset = 0; offset < NEWS_COVER_POOL.length; offset++) {
      const candidate = NEWS_COVER_POOL[(start + offset) % NEWS_COVER_POOL.length];
      if (!used.has(coverKey(candidate))) {
        chosen = candidate;
        break;
      }
    }

    if (!chosen) {
      chosen = getGeneratedCover(`${scope}-${id}`, String(article.category ?? scope));
    }

    used.add(coverKey(chosen));
    coverCache.set(cacheKey, chosen);
    return { ...article, image: chosen };
  });
}
