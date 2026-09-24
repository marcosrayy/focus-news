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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/utils/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Storage",
    ()=>Storage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data');
const NEWS_DB_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'news_db.json');
const ENGINE_STATUS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'engine_status.json');
// Ensure database files exist with initial content
function ensureDirAndFiles() {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DATA_DIR)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(DATA_DIR, {
            recursive: true
        });
    }
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(NEWS_DB_FILE)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(NEWS_DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(ENGINE_STATUS_FILE)) {
        const initialStatus = {
            lastSync: new Date(Date.now() - 3600000).toISOString(),
            syncHistory: [],
            sourcesHealth: {
                Startupi: {
                    status: 'Online',
                    lastResponseMs: 120,
                    lastChecked: new Date().toISOString()
                },
                InfoMoney: {
                    status: 'Online',
                    lastResponseMs: 150,
                    lastChecked: new Date().toISOString()
                },
                Valor: {
                    status: 'Online',
                    lastResponseMs: 180,
                    lastChecked: new Date().toISOString()
                },
                Canaltech: {
                    status: 'Online',
                    lastResponseMs: 200,
                    lastChecked: new Date().toISOString()
                },
                TechMundo: {
                    status: 'Online',
                    lastResponseMs: 210,
                    lastChecked: new Date().toISOString()
                },
                Diolinux: {
                    status: 'Online',
                    lastResponseMs: 110,
                    lastChecked: new Date().toISOString()
                },
                Gizmodo: {
                    status: 'Online',
                    lastResponseMs: 190,
                    lastChecked: new Date().toISOString()
                },
                GNews: {
                    status: 'Online',
                    lastResponseMs: 250,
                    lastChecked: new Date().toISOString()
                }
            },
            stats: {
                imported: 0,
                updated: 0,
                discarded: 0
            }
        };
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(ENGINE_STATUS_FILE, JSON.stringify(initialStatus, null, 2), 'utf-8');
    }
}
// Queue system for thread-safe file writes
class FileLockQueue {
    queue = [];
    running = false;
    async add(task) {
        return new Promise((resolve, reject)=>{
            this.queue.push(async ()=>{
                try {
                    await task();
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
            this.next();
        });
    }
    async next() {
        if (this.running || this.queue.length === 0) return;
        this.running = true;
        const task = this.queue.shift();
        if (task) {
            try {
                await task();
            } catch (err) {
                console.error('FileLockQueue task failed:', err);
            }
        }
        this.running = false;
        this.next();
    }
}
const writeQueue = new FileLockQueue();
const Storage = {
    // Read all articles
    readArticles () {
        ensureDirAndFiles();
        try {
            const data = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(NEWS_DB_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Failed to read news database, returning empty array:', err);
            return [];
        }
    },
    // Save articles (thread-safe queue write)
    async saveArticles (articles) {
        ensureDirAndFiles();
        return writeQueue.add(async ()=>{
            const tempPath = `${NEWS_DB_FILE}.tmp`;
            try {
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(tempPath, JSON.stringify(articles, null, 2), 'utf-8');
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].renameSync(tempPath, NEWS_DB_FILE);
            } catch (err) {
                console.error('Failed to save articles:', err);
                if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(tempPath)) {
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].unlinkSync(tempPath);
                }
                throw err;
            }
        });
    },
    // Read status
    readStatus () {
        ensureDirAndFiles();
        try {
            const data = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(ENGINE_STATUS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Failed to read engine status, rebuilding initial state:', err);
            // Re-create initial state
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].unlinkSync(ENGINE_STATUS_FILE);
            ensureDirAndFiles();
            return JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(ENGINE_STATUS_FILE, 'utf-8'));
        }
    },
    // Save status (thread-safe queue write)
    async saveStatus (status) {
        ensureDirAndFiles();
        return writeQueue.add(async ()=>{
            const tempPath = `${ENGINE_STATUS_FILE}.tmp`;
            try {
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(tempPath, JSON.stringify(status, null, 2), 'utf-8');
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].renameSync(tempPath, ENGINE_STATUS_FILE);
            } catch (err) {
                console.error('Failed to save engine status:', err);
                if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(tempPath)) {
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].unlinkSync(tempPath);
                }
                throw err;
            }
        });
    }
};
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
"[project]/services/refreshEngine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RefreshEngine",
    ()=>RefreshEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$newsService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/newsService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$config$2f$newsConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/config/newsConfig.ts [app-route] (ecmascript)");
;
;
;
// Categories mapping to RSS feeds
const FALLBACK_FEEDS = {
    Startups: [
        'https://startupi.com.br/feed/',
        'https://forbes.com.br/category/colunas/forbes-tech/feed/'
    ],
    Economia: [
        'https://www.infomoney.com.br/feed/',
        'https://startupi.com.br/feed/',
        'https://valor.globo.com/rss/valor/',
        'https://g1.globo.com/rss/g1/economia/'
    ],
    IA: [
        'https://canaltech.com.br/rss/',
        'https://startupi.com.br/feed/',
        'https://rss.tecmundo.com.br/feed'
    ],
    Tecnologia: [
        'https://tecnoblog.net/feed/',
        'https://rss.tecmundo.com.br/feed',
        'https://g1.globo.com/rss/g1/tecnologia/',
        'https://www.cnnbrasil.com.br/feed/'
    ],
    Dev: [
        'https://diolinux.com.br/feed',
        'https://tecnoblog.net/feed/'
    ],
    Inovacao: [
        'https://g1.globo.com/rss/g1/inovacao/',
        'https://forbes.com.br/noticias-sobre/inovacao/feed/'
    ],
    Business: [
        'https://startupi.com.br/feed/',
        'https://www.infomoney.com.br/feed/',
        'https://forbes.com.br/category/colunas/forbes-tech/feed/'
    ]
};
// Target categories to process in a refresh cycle
const CATEGORIES = [
    'Startups',
    'Economia',
    'IA',
    'Tecnologia',
    'Dev',
    'Inovacao',
    'Business'
];
// Helper to determine the source label based on feed URL
function getFeedSourceName(feedUrl) {
    const url = feedUrl.toLowerCase();
    if (url.includes('startupi')) return 'Startupi';
    if (url.includes('infomoney')) return 'InfoMoney';
    if (url.includes('valor.globo')) return 'Valor';
    if (url.includes('canaltech')) return 'Canaltech';
    if (url.includes('tecnoblog')) return 'Tecnoblog';
    if (url.includes('diolinux')) return 'Diolinux';
    if (url.includes('gizmodo')) return 'Gizmodo';
    if (url.includes('tecmundo')) return 'TechMundo';
    if (url.includes('globo.com')) return 'Globo';
    if (url.includes('cnnbrasil')) return 'CNN';
    if (url.includes('forbes')) return 'Forbes';
    return 'GNews';
}
function isValidImageUrl(url) {
    if (!url) return false;
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com') || lower.includes('/embed/')) {
        return false;
    }
    return lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('/');
}
// Calculate retention period based on content analysis
function calculateExpirationDate(title, desc, publishedAt) {
    const text = `${title} ${desc}`.toLowerCase();
    const pubTime = new Date(publishedAt).getTime();
    // Breaking News: 6 hours
    const isBreaking = [
        'urgente',
        'breaking',
        'plantao',
        'exclusivo',
        'extra',
        'urgência'
    ].some((kw)=>text.includes(kw));
    if (isBreaking) {
        return new Date(pubTime + 6 * 60 * 60 * 1000).toISOString();
    }
    // Analyses / Special features: 48 hours
    const isAnalysis = [
        'analise',
        'especial',
        'estudo',
        'pesquisa',
        'entrevista',
        'opiniao'
    ].some((kw)=>text.includes(kw));
    if (isAnalysis) {
        return new Date(pubTime + 48 * 60 * 60 * 1000).toISOString();
    }
    // Normal Tech/Market news: 24 hours
    const isMarketTech = [
        'mercado',
        'selic',
        'bolsa',
        'ações',
        'dólar',
        'chip',
        'lançamento',
        'iphone',
        'samsung'
    ].some((kw)=>text.includes(kw));
    if (isMarketTech) {
        return new Date(pubTime + 24 * 60 * 60 * 1000).toISOString();
    }
    // Evergreen / Others: 7 days
    return new Date(pubTime + 7 * 24 * 60 * 60 * 1000).toISOString();
}
// Simple hash utility to compare article bodies/titles
function calculateHash(text) {
    let hash = 0;
    for(let i = 0; i < text.length; i++){
        const char = text.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
}
// Flag to prevent overlapping sync runs
let isRunningSync = false;
const RefreshEngine = {
    async runSync (forceFull = false) {
        if (isRunningSync) {
            console.warn('[RefreshEngine] Sync is already running. Skipping overlapping run.');
            return {
                success: false,
                stats: {
                    error: 'Sync already running'
                }
            };
        }
        isRunningSync = true;
        const startTime = Date.now();
        console.log('[RefreshEngine] Starting synchronization cycle...');
        // Load existing database and status
        const existingArticles = __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Storage"].readArticles();
        const status = __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Storage"].readStatus();
        // Track stats for this run
        let importedThisRun = 0;
        let updatedThisRun = 0;
        let discardedThisRun = 0;
        const processedUrls = new Set();
        const sourceHealth = {
            ...status.sourcesHealth
        };
        // Set of IDs already in the DB to check updates vs inserts
        const articleMap = new Map();
        existingArticles.forEach((art)=>articleMap.set(art.id, art));
        // GNews API Search Sync
        if (__TURBOPACK__imported__module__$5b$project$5d2f$config$2f$newsConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NEWS_API_KEY"]) {
            const gnewsStart = Date.now();
            try {
                console.log('[RefreshEngine] Fetching fresh updates from GNews search API...');
                const q = "Startups OR Tecnologia OR Inovacao OR Negocios";
                const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=pt&max=15&apikey=${__TURBOPACK__imported__module__$5b$project$5d2f$config$2f$newsConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NEWS_API_KEY"]}`;
                const res = await fetch(url);
                const fetchDuration = Date.now() - gnewsStart;
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.articles)) {
                        sourceHealth['GNews'] = {
                            status: 'Online',
                            lastResponseMs: fetchDuration,
                            lastChecked: new Date().toISOString()
                        };
                        for (const item of data.articles){
                            const articleUrl = item.url;
                            if (processedUrls.has(articleUrl)) continue;
                            processedUrls.add(articleUrl);
                            const cleanDesc = item.description || "";
                            const sourceLabel = item.source?.name || "GNews";
                            const classification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$newsService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyArticle"])(item.title, cleanDesc, sourceLabel);
                            const articleCategory = classification.category;
                            if (articleCategory === "Rejeitado") continue;
                            const publishedAt = item.publishedAt || new Date().toISOString();
                            const expDate = calculateExpirationDate(item.title, cleanDesc, publishedAt);
                            if (new Date(expDate).getTime() < Date.now()) {
                                discardedThisRun++;
                                continue;
                            }
                            const articleEntry = {
                                id: articleUrl,
                                title: item.title,
                                description: cleanDesc,
                                url: articleUrl,
                                image: item.image || "",
                                publishedAt,
                                source: sourceLabel,
                                category: articleCategory,
                                score: classification.score,
                                importedAt: new Date().toISOString(),
                                importanceScore: classification.score + (item.title.toLowerCase().includes('urgente') ? 30 : 0),
                                expiresAt: expDate
                            };
                            if (articleMap.has(articleUrl)) {
                                const existing = articleMap.get(articleUrl);
                                articleMap.set(articleUrl, {
                                    ...existing,
                                    title: articleEntry.title,
                                    description: articleEntry.description,
                                    image: articleEntry.image,
                                    score: articleEntry.score,
                                    importanceScore: articleEntry.importanceScore
                                });
                                updatedThisRun++;
                            } else {
                                const isDuplicateTitle = Array.from(articleMap.values()).some((art)=>art.category === articleCategory && calculateHash(art.title.slice(0, 30)) === calculateHash(articleEntry.title.slice(0, 30)));
                                if (isDuplicateTitle) {
                                    discardedThisRun++;
                                    continue;
                                }
                                articleMap.set(articleUrl, articleEntry);
                                importedThisRun++;
                            }
                        }
                    }
                } else {
                    throw new Error(`HTTP status ${res.status}`);
                }
            } catch (err) {
                console.warn(`[RefreshEngine] GNews API fetch failed:`, err);
                sourceHealth['GNews'] = {
                    status: 'Instável',
                    lastResponseMs: Date.now() - gnewsStart,
                    lastChecked: new Date().toISOString()
                };
            }
        }
        // CNN Brasil GNews API Search
        if (__TURBOPACK__imported__module__$5b$project$5d2f$config$2f$newsConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NEWS_API_KEY"]) {
            const cnnStart = Date.now();
            try {
                console.log('[RefreshEngine] Fetching CNN Brasil technology updates from GNews search API...');
                const cnnUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent("CNN Brasil")}&lang=pt&max=10&apikey=${__TURBOPACK__imported__module__$5b$project$5d2f$config$2f$newsConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NEWS_API_KEY"]}`;
                const cnnRes = await fetch(cnnUrl);
                const cnnDuration = Date.now() - cnnStart;
                if (cnnRes.ok) {
                    const cnnData = await cnnRes.json();
                    if (cnnData && Array.isArray(cnnData.articles)) {
                        sourceHealth['CNN'] = {
                            status: 'Online',
                            lastResponseMs: cnnDuration,
                            lastChecked: new Date().toISOString()
                        };
                        for (const item of cnnData.articles){
                            const articleUrl = item.url;
                            if (processedUrls.has(articleUrl)) continue;
                            processedUrls.add(articleUrl);
                            const cleanDesc = item.description || "";
                            const sourceLabel = "CNN";
                            const classification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$newsService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyArticle"])(item.title, cleanDesc, sourceLabel);
                            const articleCategory = classification.category;
                            if (articleCategory === "Rejeitado") continue;
                            const publishedAt = item.publishedAt || new Date().toISOString();
                            const expDate = calculateExpirationDate(item.title, cleanDesc, publishedAt);
                            if (new Date(expDate).getTime() < Date.now()) {
                                discardedThisRun++;
                                continue;
                            }
                            const articleEntry = {
                                id: articleUrl,
                                title: item.title,
                                description: cleanDesc,
                                url: articleUrl,
                                image: item.image || "",
                                publishedAt,
                                source: sourceLabel,
                                category: articleCategory,
                                score: classification.score,
                                importedAt: new Date().toISOString(),
                                importanceScore: classification.score + (item.title.toLowerCase().includes('urgente') ? 30 : 0),
                                expiresAt: expDate
                            };
                            if (articleMap.has(articleUrl)) {
                                const existing = articleMap.get(articleUrl);
                                articleMap.set(articleUrl, {
                                    ...existing,
                                    title: articleEntry.title,
                                    description: articleEntry.description,
                                    image: articleEntry.image,
                                    score: articleEntry.score,
                                    importanceScore: articleEntry.importanceScore
                                });
                                updatedThisRun++;
                            } else {
                                const isDuplicateTitle = Array.from(articleMap.values()).some((art)=>art.category === articleCategory && calculateHash(art.title.slice(0, 30)) === calculateHash(articleEntry.title.slice(0, 30)));
                                if (isDuplicateTitle) {
                                    discardedThisRun++;
                                    continue;
                                }
                                articleMap.set(articleUrl, articleEntry);
                                importedThisRun++;
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn(`[RefreshEngine] CNN GNews API fetch failed:`, err);
            }
        }
        // Exame Startups crawler
        const exameStart = Date.now();
        try {
            console.log('[RefreshEngine] Crawling Exame Startups page directly...');
            const response = await fetch('https://exame.com/noticias-sobre/Startups/1/', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html'
                }
            });
            const fetchDuration = Date.now() - exameStart;
            if (response.ok) {
                const html = await response.text();
                // Build image map
                const imageMap = new Map();
                const imgRegex1 = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]+alt=["']([^"']+)["']/gi;
                const imgRegex2 = /<img[^>]+alt=["']([^"']+)["'][^>]+src=["'](https?:\/\/[^"']+)["']/gi;
                let imgMatch;
                while((imgMatch = imgRegex1.exec(html)) !== null){
                    const imgSrc = imgMatch[1].trim();
                    const imgTitle = imgMatch[2].trim();
                    imageMap.set(imgTitle, imgSrc);
                }
                while((imgMatch = imgRegex2.exec(html)) !== null){
                    const imgTitle = imgMatch[1].trim();
                    const imgSrc = imgMatch[2].trim();
                    imageMap.set(imgTitle, imgSrc);
                }
                const regex = /href="(https:\/\/exame\.com\/[^"]+)" class="touch-area">([^<]+)<\/a>/g;
                let match;
                let importedExame = 0;
                while((match = regex.exec(html)) !== null){
                    const articleUrl = match[1];
                    const rawTitle = match[2].trim();
                    const articleTitle = rawTitle.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                    if (processedUrls.has(articleUrl)) continue;
                    processedUrls.add(articleUrl);
                    const cleanDesc = `Acompanhe notícias sobre startups, negócios e ecossistema de inovação na revista Exame.`;
                    const sourceLabel = "Exame";
                    const articleCategory = "Startups";
                    const publishedAt = new Date().toISOString();
                    const expDate = calculateExpirationDate(articleTitle, cleanDesc, publishedAt);
                    // Get real image from map or fall back
                    const realImage = imageMap.get(articleTitle) || imageMap.get(rawTitle) || "";
                    const articleEntry = {
                        id: articleUrl,
                        title: articleTitle,
                        description: cleanDesc,
                        url: articleUrl,
                        image: realImage,
                        publishedAt,
                        source: sourceLabel,
                        category: articleCategory,
                        score: 100,
                        importedAt: new Date().toISOString(),
                        importanceScore: 100,
                        expiresAt: expDate
                    };
                    if (articleMap.has(articleUrl)) {
                        const existing = articleMap.get(articleUrl);
                        articleMap.set(articleUrl, {
                            ...existing,
                            title: articleEntry.title,
                            image: articleEntry.image
                        });
                    } else {
                        const isDuplicateTitle = Array.from(articleMap.values()).some((art)=>art.category === articleCategory && calculateHash(art.title.slice(0, 30)) === calculateHash(articleEntry.title.slice(0, 30)));
                        if (isDuplicateTitle) {
                            continue;
                        }
                        articleMap.set(articleUrl, articleEntry);
                        importedExame++;
                        importedThisRun++;
                    }
                }
                console.log(`[RefreshEngine] Exame Startups crawl finished. Imported: ${importedExame}`);
                sourceHealth['Exame'] = {
                    status: 'Online',
                    lastResponseMs: fetchDuration,
                    lastChecked: new Date().toISOString()
                };
            }
        } catch (err) {
            console.warn(`[RefreshEngine] Exame Startups crawl failed:`, err);
        }
        // Iterate over each category to update its specific feeds
        for (const category of CATEGORIES){
            const feeds = FALLBACK_FEEDS[category] || [];
            for (const feedUrl of feeds){
                const sourceName = getFeedSourceName(feedUrl);
                const feedStart = Date.now();
                try {
                    const rssApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
                    const response = await fetch(rssApiUrl, {
                        next: {
                            revalidate: 0
                        }
                    }); // bypass cache for engine run
                    const fetchDuration = Date.now() - feedStart;
                    if (!response.ok) {
                        throw new Error(`HTTP status ${response.status}`);
                    }
                    const data = await response.json();
                    if (data.status !== 'ok' || !Array.isArray(data.items)) {
                        throw new Error('Invalid feed schema from rss2json');
                    }
                    // Mark source as Online
                    sourceHealth[sourceName] = {
                        status: 'Online',
                        lastResponseMs: fetchDuration,
                        lastChecked: new Date().toISOString()
                    };
                    for (const item of data.items){
                        const articleUrl = item.link;
                        if (processedUrls.has(articleUrl)) continue;
                        processedUrls.add(articleUrl);
                        // Fetch image URL if present
                        let imageUrl = item.enclosure?.link || item.thumbnail;
                        if (!imageUrl && item.description) {
                            const match = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
                            if (match) imageUrl = match[1];
                        }
                        if (!imageUrl && item.content) {
                            const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
                            if (match) imageUrl = match[1];
                        }
                        if (!imageUrl || !isValidImageUrl(imageUrl)) {
                            imageUrl = "";
                        }
                        let cleanDesc = (item.description || "").replace(/<[^>]+>/g, '');
                        // Strip Forbes boilerplates
                        cleanDesc = cleanDesc.replace(/Forbes, a mais conceituada revista de negócios e economia do mundo\./gi, '');
                        cleanDesc = cleanDesc.replace(/O post .* apareceu primeiro em .*$/gi, '');
                        cleanDesc = cleanDesc.trim().slice(0, 150) + '...';
                        // Run classification
                        const classification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$newsService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyArticle"])(item.title, cleanDesc, sourceName);
                        let articleCategory = classification.category;
                        // Apply Startups / Business mapping override as per request
                        if (category === "Startups" && sourceName === "Startupi" && (articleCategory === "Startups" || articleCategory === "Business")) {
                            articleCategory = "Startups";
                        }
                        if (category === "Inovacao") {
                            articleCategory = "Inovacao";
                        }
                        // Verify category compatibility (only reject if classified as Rejeitado)
                        if (articleCategory === "Rejeitado") {
                            discardedThisRun++;
                            continue;
                        }
                        const publishedAt = item.pubDate || new Date().toISOString();
                        const expDate = calculateExpirationDate(item.title, cleanDesc, publishedAt);
                        // Skip expired articles
                        if (new Date(expDate).getTime() < Date.now()) {
                            discardedThisRun++;
                            continue;
                        }
                        // Create article entry
                        const articleEntry = {
                            id: articleUrl,
                            title: item.title,
                            description: cleanDesc,
                            url: articleUrl,
                            image: imageUrl,
                            publishedAt,
                            source: sourceName,
                            category: articleCategory,
                            score: classification.score,
                            importedAt: new Date().toISOString(),
                            importanceScore: classification.score + (item.title.toLowerCase().includes('urgente') ? 30 : 0),
                            expiresAt: expDate
                        };
                        if (articleMap.has(articleUrl)) {
                            // Update existing
                            const existing = articleMap.get(articleUrl);
                            articleMap.set(articleUrl, {
                                ...existing,
                                title: articleEntry.title,
                                description: articleEntry.description,
                                image: articleEntry.image,
                                score: articleEntry.score,
                                importanceScore: articleEntry.importanceScore
                            });
                            updatedThisRun++;
                        } else {
                            // Deduplicate by normalized title
                            const isDuplicateTitle = Array.from(articleMap.values()).some((art)=>art.category === articleCategory && calculateHash(art.title.slice(0, 30)) === calculateHash(articleEntry.title.slice(0, 30)));
                            if (isDuplicateTitle) {
                                discardedThisRun++;
                                continue;
                            }
                            // Insert new
                            articleMap.set(articleUrl, articleEntry);
                            importedThisRun++;
                        }
                    }
                } catch (err) {
                    console.warn(`[RefreshEngine] Feed error on ${sourceName} (${feedUrl}):`, err);
                    // Mark source as Instável or Offline
                    sourceHealth[sourceName] = {
                        status: sourceHealth[sourceName]?.status === 'Instável' ? 'Offline' : 'Instável',
                        lastResponseMs: Date.now() - feedStart,
                        lastChecked: new Date().toISOString()
                    };
                }
            }
        }
        // Apply expiration (retention logic) - filter out expired news
        const nowTime = Date.now();
        const finalArticles = Array.from(articleMap.values()).filter((art)=>{
            // If we saved an expiresAt date, verify it. Otherwise fallback to evergreen 7 days check
            const expiryStr = art.expiresAt;
            if (expiryStr) {
                return new Date(expiryStr).getTime() > nowTime;
            }
            return nowTime - new Date(art.publishedAt).getTime() < 7 * 24 * 60 * 60 * 1000;
        });
        // Save final lists back to storage
        await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Storage"].saveArticles(finalArticles);
        // Save Sync Run Log and Status
        const syncDuration = Date.now() - startTime;
        const historyEntry = {
            timestamp: new Date().toISOString(),
            durationMs: syncDuration,
            importedCount: importedThisRun,
            updatedCount: updatedThisRun,
            discardedCount: discardedThisRun,
            modules: CATEGORIES
        };
        const newStatus = {
            lastSync: new Date().toISOString(),
            syncHistory: [
                historyEntry,
                ...status.syncHistory
            ].slice(0, 50),
            sourcesHealth: sourceHealth,
            stats: {
                imported: status.stats.imported + importedThisRun,
                updated: status.stats.updated + updatedThisRun,
                discarded: status.stats.discarded + discardedThisRun
            }
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Storage"].saveStatus(newStatus);
        console.log(`[RefreshEngine] Sync cycle finished in ${syncDuration}ms. Imported: ${importedThisRun}, Updated: ${updatedThisRun}, Discarded: ${discardedThisRun}`);
        isRunningSync = false;
        return {
            success: true,
            stats: {
                durationMs: syncDuration,
                imported: importedThisRun,
                updated: updatedThisRun,
                discarded: discardedThisRun
            }
        };
    }
};
}),
"[project]/app/api/news/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$refreshEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/refreshEngine.ts [app-route] (ecmascript)");
;
;
;
const dynamic = "force-dynamic";
function getRelativeTimeServer(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMinutes < 60) {
        return `há ${diffMinutes} min`;
    } else if (diffHours < 24) {
        return `há ${diffHours}h`;
    } else if (diffDays < 7) {
        return `há ${diffDays}d`;
    } else {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short"
        });
    }
}
// Simple deterministic shuffle based on current hour
function rotateArticles(articles, category) {
    if (articles.length <= 1) return articles;
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const timeBucket = Math.floor(currentMinute / 10); // 10-minute buckets for variation
    // Separate into Featured (first 2) and Compact (rest)
    const featured = articles.slice(0, 2);
    const compact = articles.slice(2);
    // Rotate featured articles if the hour is odd
    if (featured.length === 2 && currentHour % 2 === 1) {
        featured.reverse();
    }
    // Rotate compact articles using a rotation index based on time bucket
    if (compact.length > 1) {
        const rotationIndex = (currentHour + timeBucket) % compact.length;
        const rotatedCompact = [
            ...compact.slice(rotationIndex),
            ...compact.slice(0, rotationIndex)
        ];
        return [
            ...featured,
            ...rotatedCompact
        ];
    }
    return [
        ...featured,
        ...compact
    ];
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "Geral";
    const max = parseInt(searchParams.get("max") || "6", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    try {
        // 1. Fetch current status to check for lazy sync trigger
        const status = __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Storage"].readStatus();
        const lastSyncTime = new Date(status.lastSync).getTime();
        const timeSinceLastSync = Date.now() - lastSyncTime;
        // Trigger background sync asynchronously if cache is older than 15 minutes
        if (timeSinceLastSync > 15 * 60 * 1000) {
            console.log(`[API/News] Lazy triggering sync. Stale time: ${Math.round(timeSinceLastSync / 1000)}s`);
            __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$refreshEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RefreshEngine"].runSync().catch((err)=>{
                console.error('[API/News] Lazy trigger background sync failed:', err);
            });
        }
        // 2. Fetch persisted articles
        const allArticles = __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Storage"].readArticles();
        // 3. Filter by category
        // virtual category mapping
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
        } else if (category === "IA") {
            targetCategory = "IA";
        } else if (category === "Startups") {
            targetCategory = "Startups";
        } else if (category === "Home") {
            targetCategory = "Home";
        }
        let filtered = allArticles.filter((art)=>art.category === targetCategory || targetCategory === "Home" && (art.category === "Startups" || art.category === "Tecnologia" || art.category === "Inovacao") || targetCategory === "Startups" && art.source.toLowerCase().includes("exame") || targetCategory === "Tecnologia" && art.source.toLowerCase().includes("cnn") || targetCategory === "Business" && art.source.toLowerCase().includes("forbes") || targetCategory === "Business" && art.category === "Startups" && art.source.toLowerCase().includes("startupi"));
        // Strictly enforce sources for Inovacao to filter out old cached data
        if (targetCategory === "Inovacao") {
            filtered = filtered.filter((art)=>{
                const lowerSrc = art.source.toLowerCase();
                return lowerSrc.includes("g1") || lowerSrc.includes("globo") || lowerSrc.includes("forbes");
            });
        }
        // Fallback to synchronous live fetch if cache is empty or insufficient
        if (filtered.length < max) {
            console.log(`[API/News] Insufficient articles for ${targetCategory} in Storage (${filtered.length}/${max}), fetching live...`);
            const { fetchNewsBackend } = await __turbopack_context__.A("[project]/services/newsService.ts [app-route] (ecmascript, async loader)");
            const freshArticles = await fetchNewsBackend({
                query,
                category: targetCategory,
                max: max * 2,
                offset
            });
            const existingIds = new Set(filtered.map((a)=>a.id));
            for (const fa of freshArticles){
                if (!existingIds.has(fa.id)) {
                    filtered.push({
                        ...fa,
                        category: fa.category || targetCategory,
                        score: fa.score || 0,
                        importedAt: new Date().toISOString(),
                        importanceScore: fa.score || 0
                    });
                }
            }
        }
        // If query is specified, do title/desc text match (supporting "OR" separation)
        // Only apply if querying general news (Geral / Destaques) to avoid filtering out specific module news
        if (query && (category === "Geral" || category === "Destaques")) {
            const keywords = query.toLowerCase().split(/\s+or\s+/i).map((k)=>k.replace(/"/g, '').trim()).filter(Boolean);
            if (keywords.length > 0) {
                filtered = filtered.filter((art)=>{
                    const title = art.title.toLowerCase();
                    const desc = art.description.toLowerCase();
                    return keywords.some((k)=>title.includes(k) || desc.includes(k));
                });
            }
        }
        // Filter out articles without valid images
        filtered = filtered.filter((art)=>{
            const img = art.image || "";
            const isBadImg = !img || img.includes("youtube.com") || img.includes("youtu.be") || img.includes("vimeo.com") || img.includes("/embed/");
            return !isBadImg;
        });
        // Sort by publish date and then import importance
        filtered.sort((a, b)=>new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        // Apply natural rotation
        const rotated = rotateArticles(filtered, targetCategory);
        // Paginate/slice
        const articles = rotated.slice(offset, offset + max);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            articles,
            isFallback: articles.length === 0,
            lastSync: status.lastSync,
            lastSyncRelative: getRelativeTimeServer(status.lastSync)
        });
    } catch (error) {
        console.error("[API/News] Failed to serve articles:", error);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__5831ecd2._.js.map