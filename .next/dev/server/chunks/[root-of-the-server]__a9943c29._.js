module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/config/newsConfig.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NEWS_API_KEY",
    ()=>NEWS_API_KEY,
    "NEWS_PROVIDER",
    ()=>NEWS_PROVIDER,
    "providerEndpoints",
    ()=>providerEndpoints
]);
const NEWS_PROVIDER = process.env.NEWS_PROVIDER || "GNews";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "2094ecfb05e8d4f4b5817fa2fb1a5179";
const providerEndpoints = {
    GNews: "https://gnews.io/api/v4",
    FreeNewsAPI: "https://freenewsapi.com/api/v1",
    NewsAPI: "https://newsapi.org/v2"
};
}),
"[project]/services/newsService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MODULE_SOURCES",
    ()=>MODULE_SOURCES,
    "classifyArticle",
    ()=>classifyArticle,
    "fetchNewsBackend",
    ()=>fetchNewsBackend,
    "isSourceAllowed",
    ()=>isSourceAllowed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$config$2f$newsConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/config/newsConfig.ts [app-route] (ecmascript)");
;
const MODULE_SOURCES = {
    Startups: [
        "startupi",
        "forbes",
        "gnews"
    ],
    Economia: [
        "infomoney",
        "mercado tech",
        "valor",
        "globo",
        "cnn",
        "gnews"
    ],
    IA: [
        "canaltech",
        "techmundo",
        "noticias ia",
        "gnews"
    ],
    Tecnologia: [
        "tecnoblog",
        "noticias tech",
        "techmundo",
        "globo",
        "cnn",
        "forbes",
        "gnews"
    ],
    Dev: [
        "tecnoblog",
        "noticias tech",
        "canaltech",
        "gnews"
    ],
    Inovacao: [
        "globo",
        "forbes"
    ],
    Business: [
        "startupi",
        "infomoney",
        "valor",
        "forbes",
        "gnews"
    ]
};
// 2. Palavras-chave Permitidas por Módulo (para cálculo de Score)
const MODULE_KEYWORDS = {
    Startups: [
        "startup",
        "startups",
        "empreendedorismo",
        "empreendedor",
        "venture capital",
        "aceleracao",
        "incubadora",
        "founder",
        "founders",
        "negocios digitais",
        "saas",
        "unicornio",
        "unicornios",
        "ecossistema",
        "fintech",
        "fintechs",
        "rodada de investimento",
        "rodadas de investimento",
        "aporte",
        "innovation hub"
    ],
    Economia: [
        "economia",
        "mercado financeiro",
        "empresas",
        "investimentos",
        "bolsa",
        "negocios",
        "macroeconomia",
        "fintechs",
        "empresas brasileiras",
        "resultados financeiros",
        "inflacao",
        "juros",
        "acoes",
        "financas",
        "pib",
        "receita",
        "lucro",
        "selic",
        "cambio",
        "dolar",
        "acordo",
        "compra",
        "venda",
        "fusao",
        "aquisicao",
        "banco",
        "bancos",
        "financeiro",
        "financeira",
        "empresa",
        "bilhoes",
        "milhoes",
        "bilhao",
        "milhao",
        "reais",
        "dolares",
        "euro",
        "mercado",
        "investir",
        "investimento",
        "investidor",
        "investidores",
        "acao",
        "lucros",
        "prejuizo",
        "faturamento"
    ],
    IA: [
        "ia",
        "artificial intelligence",
        "inteligencia artificial",
        "chatgpt",
        "openai",
        "anthropic",
        "google ai",
        "gemini",
        "claude",
        "llms",
        "llm",
        "machine learning",
        "deep learning",
        "ia generativa",
        "robotica",
        "automacao inteligente",
        "copilot",
        "automation ai"
    ],
    Tecnologia: [
        "software",
        "hardware",
        "computacao",
        "smartphone",
        "celular",
        "android",
        "ios",
        "tecnologia",
        "processador",
        "chips",
        "vazamento",
        "lancamento",
        "gadgets",
        "console",
        "videogame",
        "playstation",
        "xbox",
        "nintendo",
        "pc",
        "samsung",
        "apple",
        "motorola",
        "xiaomi"
    ],
    Dev: [
        "desenvolvimento",
        "programacao",
        "cloud",
        "infraestrutura",
        "apis",
        "api",
        "seguranca",
        "devops",
        "frameworks",
        "framework",
        "bancos de dados",
        "javascript",
        "python",
        "java",
        "node",
        "react",
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
        "linux",
        "github",
        "backend",
        "frontend",
        "git",
        "codigo",
        "coding",
        "software",
        "programador",
        "desenvolvedor"
    ],
    Inovacao: [
        "inovacao",
        "pesquisa",
        "patente",
        "descoberta",
        "ciencia",
        "cientifico",
        "cientistas",
        "vacina",
        "espacial",
        "nasa",
        "astronomia",
        "planeta",
        "energia limpa",
        "energia sustentavel",
        "biotecnologia",
        "medicina",
        "cura",
        "saude",
        "avanco",
        "futuro",
        "fusao nuclear",
        "genetica",
        "quantum",
        "computacao quantica",
        "invenção",
        "descobertas",
        "tecnologica",
        "transformacao digital"
    ],
    Business: [
        "empreendedorismo",
        "empreendedor",
        "empreendedora",
        "negocios",
        "negocio",
        "gestao",
        "lideranca",
        "ceo",
        "cto",
        "cfo",
        "c-level",
        "empresa",
        "empresas",
        "crescimento",
        "escala",
        "escalabilidade",
        "receita",
        "faturamento",
        "plg",
        "product led growth",
        "modelo de negocio",
        "saas",
        "b2b",
        "b2c",
        "cultura organizacional",
        "trabalho remoto",
        "hibrido",
        "produtividade",
        "ipo",
        "abertura de capital",
        "expansao",
        "mercado",
        "cases",
        "inovacao corporativa",
        "transformacao digital",
        "franquia",
        "franquias",
        "varejo",
        "e-commerce",
        "marketplace"
    ]
};
// 3. Proibições Absolutas (Mata-mata - Score vira 0 imediatamente)
const PROHIBITED_TERMS = [
    "politica",
    "eleicoes",
    "lula",
    "bolsonaro",
    "stf",
    "bbb",
    "reality show",
    "reality",
    "futebol",
    "esportes",
    "esporte",
    "crimes",
    "crime",
    "acidentes",
    "acidente",
    "fofocas",
    "fofoca",
    "novelas",
    "novela",
    "celebridades",
    "celebridade",
    "famosos",
    "influenciadores",
    "influenciador",
    "horoscopo",
    "loterias",
    "loteria",
    "adulto",
    "copa",
    "copa do mundo",
    "artilheiro",
    "gol",
    "flamengo",
    "palmeiras",
    "corinthians",
    "neymar",
    "mbappe",
    "messi",
    "cristiano ronaldo",
    "atleta",
    "olimpiadas",
    "campeonato",
    "torneio",
    "jogo",
    "jogos",
    "nba",
    "ufc",
    "boxe",
    "tenis",
    "formula 1",
    "f1",
    "governo",
    "candidato",
    "eleitor",
    "prefeito",
    "governador",
    "presidente",
    "senador",
    "deputado",
    "partido",
    "ministro",
    "ministerio",
    "pf",
    "policia federal",
    "tse",
    "senado",
    "congresso",
    "camara",
    "parlamento",
    "guerra",
    "conflito",
    "militar",
    "ataque",
    "ataques",
    "morte",
    "mortes",
    "atentado",
    "missil",
    "misseis",
    "bombardeio",
    "terrorista",
    "terrorismo",
    "ira",
    "jordania",
    "israel",
    "gaza",
    "palestina",
    "russia",
    "ucrania",
    "morreu",
    "morreram",
    "preso",
    "presos",
    "prisao",
    "prisoes",
    "custodia",
    "presidio",
    "policia",
    "policial",
    "homicidio",
    "assassinado",
    "assassinada",
    "assassinatos",
    "tortura"
];
// Helper para normalizar strings (remove acentos e caixa alta)
function normalizeText(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
// Helper para contar ocorrências exatas de palavras-chave no texto
function countMatches(text, keywords) {
    let count = 0;
    const normText = normalizeText(text);
    for (const kw of keywords){
        const kwNorm = normalizeText(kw);
        const escaped = kwNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Se o termo tem espaço, busca literal, senão busca palavra inteira com limite de borda
        const regex = kwNorm.includes(' ') ? new RegExp(escaped, 'g') : new RegExp('\\b' + escaped + '\\b', 'g');
        const matches = normText.match(regex);
        if (matches) {
            count += matches.length;
        }
    }
    return count;
}
function classifyArticle(title, description, source) {
    const fullText = `${title} ${description}`;
    const normText = normalizeText(fullText);
    const normSource = normalizeText(source);
    // Regra Mata-mata (Proibições)
    const hasProhibited = PROHIBITED_TERMS.some((term)=>{
        const termNorm = normalizeText(term);
        const regex = new RegExp('\\b' + termNorm + '\\b', 'i');
        return regex.test(normText);
    });
    if (hasProhibited) {
        return {
            category: "Rejeitado",
            score: 0
        };
    }
    // PASSO 1: Identificar a origem para definir a categoria permitida diretamente (Fontes Estritas)
    if (normSource.includes("startupi")) {
        // Classificar IA somente se palavras-chave de IA dominam claramente sobre Business
        const iaMatches = countMatches(fullText, MODULE_KEYWORDS.IA);
        const bizTotal = countMatches(fullText, MODULE_KEYWORDS.Business);
        if (iaMatches > 0 && iaMatches > bizTotal) {
            return {
                category: "IA",
                score: 100
            };
        }
        const isFintech = [
            "fintech",
            "financeira",
            "banco digital",
            "pagamento digital",
            "credito digital"
        ].some((w)=>normText.includes(w));
        if (isFintech) {
            return {
                category: "Economia",
                score: 100
            };
        }
        // Startupi é naturalmente sobre empreendedorismo — classifica como Startups OU Business
        // Somente artigos com termos explícitos de VC/funding/rodadas vão para Startups
        const startupMatches = countMatches(fullText, [
            "venture capital",
            "rodada de investimento",
            "aporte",
            "seed",
            "serie a",
            "serie b",
            "unicornio",
            "incubadora",
            "aceleradora"
        ]);
        if (startupMatches > 0) {
            return {
                category: "Startups",
                score: 100
            };
        }
        return {
            category: "Business",
            score: 100
        };
    }
    if (normSource.includes("infomoney") || normSource.includes("mercado tech") || normSource.includes("valor")) {
        // InfoMoney/Valor com keywords de Business
        const bizMatches = countMatches(fullText, MODULE_KEYWORDS.Business);
        const econMatches = countMatches(fullText, MODULE_KEYWORDS.Economia);
        if (bizMatches > econMatches) {
            return {
                category: "Business",
                score: 100
            };
        }
        return {
            category: "Economia",
            score: 100
        };
    }
    // Tecnoblog e Notícias Tech podem ter classificação entre Tecnologia e Dev
    const isTechSource = normSource.includes("tecnoblog") || normSource.includes("noticias tech");
    if (isTechSource) {
        const devMatches = countMatches(fullText, MODULE_KEYWORDS.Dev);
        const techMatches = countMatches(fullText, MODULE_KEYWORDS.Tecnologia);
        const total = devMatches + techMatches;
        if (total === 0) {
            return {
                category: "Tecnologia",
                score: 100
            }; // Fallback seguro
        }
        const devScore = devMatches / total * 100;
        if (devScore >= 70) {
            return {
                category: "Dev",
                score: Math.round(devScore)
            };
        }
        return {
            category: "Tecnologia",
            score: 100
        };
    }
    // Se a fonte for Diolinux, classifica diretamente como Dev
    if (normSource.includes("diolinux")) {
        return {
            category: "Dev",
            score: 100
        };
    }
    // Para fontes híbridas e gerais (Canaltech, TechMundo, Gizmodo, Globo, CNN, Forbes, GNews, etc.)
    const isHybrid = [
        "canaltech",
        "techmundo",
        "noticias ia",
        "gizmodo",
        "startupi",
        "globo",
        "cnn",
        "forbes",
        "gnews"
    ].some((src)=>normSource.includes(src));
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
            return {
                category: "Rejeitado",
                score: 0
            };
        }
        const iaScore = iaMatches / total * 100;
        const techScore = tecnologiaMatches / total * 100;
        const devScore = devMatches / total * 100;
        const inovacaoScore = inovacaoMatches / total * 100;
        const startupsScore = startupsMatches / total * 100;
        const economiaScore = economiaMatches / total * 100;
        const businessScore = businessMatches / total * 100;
        const maxScore = Math.max(iaScore, techScore, devScore, inovacaoScore, startupsScore, economiaScore, businessScore);
        if (maxScore === iaScore && iaScore >= 80) {
            return {
                category: "IA",
                score: Math.round(iaScore)
            };
        } else if (maxScore === devScore && devScore >= 80) {
            return {
                category: "Dev",
                score: Math.round(devScore)
            };
        } else if (maxScore === inovacaoScore && inovacaoScore >= 80) {
            return {
                category: "Inovacao",
                score: Math.round(inovacaoScore)
            };
        } else if (maxScore === startupsScore && startupsScore >= 75) {
            return {
                category: "Startups",
                score: Math.round(startupsScore)
            };
        } else if (maxScore === economiaScore && economiaScore >= 75) {
            return {
                category: "Economia",
                score: Math.round(economiaScore)
            };
        } else if (maxScore === businessScore && businessScore >= 75) {
            return {
                category: "Business",
                score: Math.round(businessScore)
            };
        } else if (techScore >= 75) {
            return {
                category: "Tecnologia",
                score: Math.round(techScore)
            };
        }
    }
    return {
        category: "Rejeitado",
        score: 0
    };
}
function isSourceAllowed(source, targetCategory) {
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
    return allAllowed.some((src)=>normSource.includes(src));
}
async function fetchNewsBackend({ query, category = "Geral", max = 6, offset = 0 }) {
    let approvedArticles = [];
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
    const seenUrls = new Set();
    try {
        // API GNEWS como Fonte Primária
        if (targetCategory !== "Inovacao") {
            const searchQuery = query || "tecnologia OR startups OR economia OR inteligência artificial";
            const apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=pt&max=${(max + offset) * 2}&apikey=${__TURBOPACK__imported__module__$5b$project$5d2f$config$2f$newsConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NEWS_API_KEY"]}`;
            const res = await fetch(apiUrl, {
                next: {
                    revalidate: 300
                }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.articles && Array.isArray(data.articles)) {
                    for (const item of data.articles){
                        if (!item.image || seenUrls.has(item.url)) continue;
                        const sourceName = typeof item.source === 'object' ? item.source.name : item.source;
                        // Validação 1: Origem Válida
                        if (!isSourceAllowed(sourceName, targetCategory)) continue;
                        // Validação 2: Classificação e Score Semântico
                        const classification = classifyArticle(item.title, item.description || "", sourceName);
                        let articleCategory = classification.category;
                        if (targetCategory === "Startups" && sourceName.toLowerCase().includes("startupi") && (articleCategory === "Startups" || articleCategory === "Business")) {
                            articleCategory = "Startups";
                        }
                        if (articleCategory !== targetCategory) continue;
                        seenUrls.add(item.url);
                        approvedArticles.push({
                            id: item.url,
                            title: item.title,
                            description: item.description,
                            url: item.url,
                            image: item.image,
                            publishedAt: item.publishedAt,
                            source: sourceName,
                            category: targetCategory,
                            score: classification.score
                        });
                        if (approvedArticles.length >= max + offset) break;
                    }
                }
            }
        }
    } catch (error) {
        console.warn(`[GNews API] Fetch failed. Error:`, error);
    }
    // Se não obteve artigos suficientes do GNews, recorre ao Fallback RSS
    if (approvedArticles.length < max + offset) {
        try {
            console.warn(`[FocusNews] GNews returned insufficient results. Using RSS Fallback for ${targetCategory}...`);
            let feedUrls = [
                'https://tecnoblog.net/feed/'
            ];
            if (targetCategory === "Startups") {
                feedUrls = [
                    'https://startupi.com.br/feed/'
                ];
            } else if (targetCategory === "Economia" || targetCategory === "Trade") {
                feedUrls = [
                    'https://www.infomoney.com.br/feed/',
                    'https://startupi.com.br/feed/',
                    'https://valor.globo.com/rss/valor/'
                ];
            } else if (targetCategory === "Business") {
                feedUrls = [
                    'https://startupi.com.br/feed/',
                    'https://www.infomoney.com.br/feed/'
                ];
            } else if (targetCategory === "IA") {
                feedUrls = [
                    'https://canaltech.com.br/rss/',
                    'https://startupi.com.br/feed/'
                ];
            } else if (targetCategory === "Dev") {
                feedUrls = [
                    'https://diolinux.com.br/feed'
                ];
            } else if (targetCategory === "Inovacao") {
                feedUrls = [
                    'https://g1.globo.com/rss/g1/inovacao/',
                    'https://forbes.com.br/noticias-sobre/inovacao/feed/'
                ];
            }
            const allItems = [];
            // Busca concorrente nos feeds configurados
            await Promise.all(feedUrls.map(async (feedUrl)=>{
                try {
                    const rssApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
                    const rssRes = await fetch(rssApiUrl, {
                        next: {
                            revalidate: 300
                        }
                    });
                    if (rssRes.ok) {
                        const rssData = await rssRes.json();
                        if (rssData.items && Array.isArray(rssData.items)) {
                            allItems.push(...rssData.items.map((item)=>({
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
            allItems.sort((a, b)=>new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime());
            for (const item of allItems){
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
                const cleanDesc = (item.description || "").replace(/<[^>]+>/g, '').slice(0, 150) + '...';
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
                }
                const classification = classifyArticle(item.title, cleanDesc, feedSource);
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
                    title: item.title,
                    description: cleanDesc,
                    url: item.link,
                    image: imageUrl || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000",
                    publishedAt: item.pubDate,
                    source: feedSource,
                    category: targetCategory,
                    score: classification.score
                });
                if (approvedArticles.length >= max + offset) break;
            }
        } catch (e) {
            console.error("[FocusNews] RSS Fallback failed:", e);
        }
    }
    return approvedArticles.slice(offset);
}
}),
"[project]/app/api/gnews/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$newsService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/newsService.ts [app-route] (ecmascript)");
;
;
// ==========================================
// GNEWS ROUTE — Agora usa o newsService unificado
// Sem dados mockados. Sem imagens fictícias.
// ==========================================
// Mapeamento de categorias da API antiga para o novo sistema
const CATEGORY_MAP = {
    technology: "Tecnologia",
    business: "Business",
    science: "Inovacao",
    general: "Geral",
    entertainment: "Tecnologia",
    health: "Inovacao",
    sports: "Tecnologia"
};
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || "technology";
    const max = searchParams.get("max") || "12";
    // Converter a categoria legada para o novo sistema
    const mappedCategory = CATEGORY_MAP[category] || "Geral";
    try {
        const articles = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$newsService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchNewsBackend"])({
            query: mappedCategory,
            category: mappedCategory,
            max: parseInt(max)
        });
        // Normalizar o formato de saída para compatibilidade com lib/news-service.ts
        const normalizedArticles = articles.map((article)=>({
                ...article,
                source: typeof article.source === "string" ? {
                    name: article.source
                } : article.source
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            articles: normalizedArticles,
            isFallback: articles.length === 0
        });
    } catch (error) {
        console.error("[FocusNews] Error fetching news:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            articles: [],
            isFallback: true,
            error: "Failed to fetch news"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a9943c29._.js.map