export const DEFAULT_DEV_NEWS_QUERY =
  "desenvolvimento OR programação OR software OR desenvolvedor OR código OR DevOps OR framework";

export const DEV_TOPIC_QUERIES: Record<string, string> = {
  frontend: "frontend OR React OR Next.js OR UI OR componentes",
  backend: "backend OR Node.js OR API OR microservicos OR banco de dados",
  mobile: "mobile OR Flutter OR React Native OR iOS OR Android",
  devops: "DevOps OR Docker OR Kubernetes OR CI/CD OR deploy",
  "ai-dev": "IA para dev OR machine learning OR LLM OR copilots OR automacao",
  web3: "Web3 OR blockchain OR smart contracts OR crypto",
  trpc: "tRPC OR TypeScript OR API type-safe OR backend",
  rust: "Rust OR sistemas OR performance OR compilacao",
  playwright: "Playwright OR testes e2e OR CI/CD OR QA",
  mf: "Module Federation OR microfrontends OR frontend OR arquitetura",
};

export function getDevNewsQuery(topic: string): string {
  return DEV_TOPIC_QUERIES[topic] || DEFAULT_DEV_NEWS_QUERY;
}
