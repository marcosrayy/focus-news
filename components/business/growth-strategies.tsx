"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useNews } from "@/hooks/useNews";
import { Clock, MessageSquare } from "lucide-react";
import { ArticleModal, type ArticleModalData } from "@/components/article-modal";
import { useNewsRotation } from "@/hooks/use-news-rotation";
import { FeaturedNewsCarousel, NewsSectionLayout } from "@/components/news-section-layout";
import { getDistinctCover } from "@/lib/utils";
import type { ReactNode } from "react";

interface BusinessArticle {
  id: number | string;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  image: string;
  time: string;
  comments: number;
  author: string;
  metric: string;
  metricLabel: string;
}

const articles: BusinessArticle[] = [
  { id: 1, category: "CRESCIMENTO", categoryColor: "bg-amber-600", title: "Product-Led Growth: como empresas SaaS brasileiras estao crescendo 3x mais rapido", description: "Estudo revela que startups com estrategia PLG tem CAC 60% menor e retencao 40% maior.", image: getDistinctCover("business-growth-1"), time: "30 min", comments: 234, author: "Marina Santos", metric: "+300%", metricLabel: "ARR medio" },
  { id: 2, category: "LIDERANCA", categoryColor: "bg-violet-600", title: "O novo perfil do C-Level: por que 67% dos CEOs tech tem background em engenharia", description: "Pesquisa com 500 empresas mostra mudanca no perfil de lideranca executiva no setor de tecnologia.", image: getDistinctCover("business-growth-2"), time: "1h", comments: 187, author: "Ricardo Alves", metric: "67%", metricLabel: "CEOs tech" },
  { id: 3, category: "CASES", categoryColor: "bg-emerald-600", title: "iFood atinge breakeven e reveals estrategia de diversificacao com entregas de saude", description: "Empresa brasileira lucra pela primeira vez e anuncia expansao para entregas de medicamentos e exames.", image: getDistinctCover("business-growth-3"), time: "2h", comments: 345, author: "Julia Ferreira", metric: "R$ 45B", metricLabel: "GMV anual" },
  { id: 4, category: "MERCADO", categoryColor: "bg-sky-600", title: "IPOs tech voltam ao radar: 12 empresas brasileiras preparam abertura de capital", description: "Janela de oportunidade se abre com queda da Selic e valorizacao de ativos de tecnologia.", image: getDistinctCover("business-growth-4"), time: "3h", comments: 198, author: "Paulo Mendes", metric: "12", metricLabel: "IPOs previstos" },
  { id: 5, category: "CULTURA", categoryColor: "bg-amber-600", title: "Trabalho remoto vs hibrido: pesquisa revela modelo ideal para produtividade em tech", description: "Dados de 10 mil funcionarios mostram que modelo hibrido 3-2 gera melhor resultado.", image: getDistinctCover("business-growth-5"), time: "4h", comments: 567, author: "Camila Dias", metric: "+23%", metricLabel: "Produtividade" },
  { id: 6, category: "EXPANSAO", categoryColor: "bg-emerald-600", title: "VTEX conquista mercado europeu e se torna lider em comercio composable na regiao", description: "Empresa brasileira de e-commerce enterprise fecha contratos com 5 grandes varejistas europeus.", image: getDistinctCover("business-growth-6"), time: "5h", comments: 143, author: "Andre Costa", metric: "5", metricLabel: "Novos mercados" },
];

export function GrowthStrategies({ sidebar }: { sidebar?: ReactNode }) {
  const [selected, setSelected] = useState<any | null>(null);
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "all";

  const topicQueries: Record<string, string> = {
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
  };

  const activeQuery = topicQueries[topic] || "Empreendedorismo OR Negocios OR Empresas OR Startups OR Economia OR Mercado Tech";

  const { 
    articles: apiNews,
    lastSyncRelative
  } = useNews(activeQuery, "Business", 15, 1);
  
  const displayArticles = apiNews.length > 0 ? apiNews.map((n: any, i: number) => {
    const mock = articles[i % articles.length];
    return { ...mock, id: `${n.id ?? n.url ?? mock.id}-${i}`, title: n.title, description: n.description, image: n.image, url: n.url, time: "agora" };
  }) : [];
  const { featuredArticles, remainingArticles } = useNewsRotation(displayArticles);

  return (
    <>
      {lastSyncRelative && (
        <div className="mb-3 flex justify-end">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider animate-pulse">
            Atualizado {lastSyncRelative}
          </span>
        </div>
      )}
      <NewsSectionLayout
        sidebar={sidebar}
        featured={
          <FeaturedNewsCarousel label="Notícias de negócios em destaque">
            {featuredArticles.map((article) => (
              <FeaturedBusinessCard key={article.id} article={article} onClick={() => article.url ? window.open(article.url, "_blank") : setSelected(article)} />
            ))}
          </FeaturedNewsCarousel>
        }
        list={remainingArticles.length > 0 ? (
          <div className="flex flex-col gap-3">
          {remainingArticles.map((article) => (
            <CompactBusinessCard key={article.id} article={article} onClick={() => article.url ? window.open(article.url, "_blank") : setSelected(article)} />
          ))}
          </div>
        ) : null}
      />
      <ArticleModal article={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </>
  );
}

function FeaturedBusinessCard({ article, onClick }: { article: BusinessArticle; onClick: () => void }) {
  return (
    <article onClick={onClick} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-400/5">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <span className={`${article.categoryColor} rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider text-white`}>{article.category}</span>
        </div>
        <div className="absolute bottom-3 right-3 rounded-lg border border-amber-500/30 bg-background/80 px-3 py-1.5 backdrop-blur-sm">
          <p className="font-heading text-sm font-bold text-amber-400">{article.metric}</p>
          <p className="text-[9px] text-muted-foreground">{article.metricLabel}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-amber-400 lg:text-base">
          <span className="text-balance">{article.title}</span>
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{article.description}</p>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">{article.author}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[10px]">{article.time}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span className="text-[10px]">{article.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactBusinessCard({ article, onClick }: { article: BusinessArticle; onClick: () => void }) {
  return (
    <article onClick={onClick} className="group flex cursor-pointer gap-4 rounded-xl border border-border bg-card p-3 transition-all duration-300 hover:border-amber-400/30 hover:shadow-md hover:shadow-amber-400/5">
      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className={`${article.categoryColor} absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white`}>{article.category}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-amber-400">{article.title}</h3>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{article.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">{article.author}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            <span className="text-[10px]">{article.time}</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-400">{article.metric}</span>
        </div>
      </div>
    </article>
  );
}
