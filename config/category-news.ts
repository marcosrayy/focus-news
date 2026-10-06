import { getDevNewsQuery } from "@/config/dev-news";

export const categoryContent = {
  home: {
    category: "Home",
    query: "Tecnologia OR Empreendedorismo OR IA",
    label: "DESTAQUE",
  },
  tecnologia: {
    category: "Tecnologia",
    query: "Tecnologia OR Hardware OR Software OR Noticias Tech",
    label: "TECNOLOGIA",
  },
  dev: {
    category: "Dev",
    query: "Desenvolvimento de software OR programação OR frameworks OR ferramentas para desenvolvedores",
    label: "DESENVOLVIMENTO",
  },
  startups: {
    category: "Startups",
    query: "\"Startup\" OR \"Venture Capital\" OR \"Fintech\" OR \"Rodada de investimento\"",
    label: "STARTUPS",
  },
  economia: {
    category: "Economia",
    query: "Economia OR mercado financeiro OR Ibovespa OR inflação OR juros",
    label: "ECONOMIA",
  },
  ia: {
    category: "IA",
    query: "Inteligencia Artificial OR IA OR ChatGPT OR OpenAI OR Plataformas de IA OR Tech Mundo OR Noticia de IA",
    label: "INTELIGÊNCIA ARTIFICIAL",
  },
  business: {
    category: "Business",
    query: "Empreendedorismo OR Negocios OR Empresas OR Startups OR Economia OR Mercado Tech",
    label: "BUSINESS",
  },
  trade: {
    category: "Trade",
    query: "Bolsa de valores OR Mercado Financeiro OR Ibovespa OR B3 OR Mercado Tech OR Fintech OR Fintechs",
    label: "TRADE & MERCADOS",
  },
  inovacao: {
    category: "Inovacao",
    query: "",
    label: "INOVAÇÃO",
  },
} as const;

export type CategoryKey = keyof typeof categoryContent;

const topicQueries: Partial<Record<CategoryKey, Record<string, string>>> = {
  tecnologia: {
    ai: "Inteligencia Artificial OR IA OR ChatGPT OR OpenAI OR LLM",
    cloud: "Cloud Computing OR AWS OR Azure OR GCP OR Kubernetes",
    cyber: "Ciberseguranca OR Cybersecurity OR segurança digital OR ransomware",
    web3: "Blockchain OR Web3 OR cripto OR Ethereum OR Bitcoin",
    hardware: "Hardware OR chip OR processador OR GPU OR CPU OR smartphone",
    "m4-vs-snapdragon": "M4 Ultra OR Snapdragon X Elite OR processadores",
    "cloud-compare": "AWS OR Azure OR GCP OR Cloud Computing",
    "ai-models": "GPT-5 OR Claude 4 OR Gemini 2 OR IA generativa",
    quantum: "computacao quantica OR quantum computing",
    "ai-dev": "IA generativa OR desenvolvimento de software OR copilots",
    edge: "edge computing OR computacao em periferia",
  },
  startups: {
    fintech: 'Fintech OR "banco digital" OR "pagamentos" OR "startup fintech"',
    ai: "IA OR inteligência artificial OR agentes OR deep tech",
    logistics: "logistica OR marketplace OR delivery OR mobility",
    edtech: "EdTech OR educação digital OR educação startup",
    healthtech: "HealthTech OR saúde digital OR biotech OR medicina",
    proptech: "PropTech OR imobiliário digital OR real estate tech",
    logtech: "LogTech OR logística digital OR supply chain",
    agtech: "AgTech OR agricultura digital OR agritech",
    cleantech: "CleanTech OR sustentabilidade OR energia limpa",
  },
  ia: {
    regulacao: "ética de IA OR regulamentação de IA OR AI Act OR governo IA",
    brasil: "Brasil OR IA OR marco legal OR inteligência artificial brasileira",
    seguranca: "segurança de IA OR model safety OR guardrails OR AI safety",
    juridico: "IA e direito OR juridico OR legal tech OR IA e Justiça",
    eua: "IA nos EUA OR OpenAI OR Anthropic OR Microsoft AI",
    china: "DeepSeek OR IA na China OR LLMs chineses",
    europa: "IA na Europa OR Mistral OR AI Act OR regulamentação",
    "brasil-ia": "IA no Brasil OR startups de IA OR inteligência artificial brasileira",
    saude: "IA em saúde OR diagnóstico por IA OR medicina IA",
    financas: "IA em finanças OR trading algorítmico OR IA e bancos",
  },
  business: {
    fintech: "Fintech OR pagamentos OR banco digital OR mercado financeiro",
    foodtech: "FoodTech OR delivery OR restaurantes OR consumo",
    commerce: "E-commerce OR varejo digital OR marketplace OR comercio online",
    wellbeing: "Wellbeing OR fitness OR saúde digital OR cultura empresarial",
    payments: "pagamentos OR fintech OR processamento de pagamentos",
    ai: "IA OR inteligencia artificial OR automatizacao OR produtividade",
    expansion: "expansao internacional OR expansao de mercado OR internacionalizacao",
    mna: "fusao OR aquisicao OR M&A OR consolidacao de mercado",
    esg: "ESG OR sustentabilidade OR impacto social OR clima",
    events: "startup OR evento OR conferencias OR founders",
    networking: "networking OR startup OR investidores OR founders",
    roadshow: "roadshow OR startup OR investidores OR market",
  },
  inovacao: {
    cleantech: "CleanTech OR energia limpa OR sustentabilidade OR clima",
    biotech: "biotech OR biotecnologia OR pesquisa OR medicina",
    agtech: "AgTech OR agricultura digital OR agronegócio OR cultivo",
    edtech: "EdTech OR educação digital OR ensino inovador",
    cooperativism: "cooperativismo OR economia colaborativa OR plataforma cooperativa",
    "impact-as-service": "impact-as-a-service OR impacto social OR inovação social",
    "open-hardware": "open hardware OR hardware aberto OR tecnologia aberta",
    urbanismo: "urbanismo OR cidades inteligentes OR infraestrutura",
    sustentabilidade: "sustentabilidade OR bioeconomia OR meio ambiente",
    educacao: "educação digital OR ensino inovador OR IA na educação",
  },
};

export function getCategoryNewsQuery(category: CategoryKey, topic: string): string {
  if (category === "dev") return getDevNewsQuery(topic);
  return topicQueries[category]?.[topic] || categoryContent[category].query;
}
