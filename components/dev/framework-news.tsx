"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useNews } from "@/hooks/useNews";
import { Clock, MessageSquare, ArrowUpRight } from "lucide-react";
import { ArticleModal, type ArticleModalData } from "@/components/article-modal";
import { useNewsRotation } from "@/hooks/use-news-rotation";
import { FeaturedNewsCarousel, NewsSectionLayout } from "@/components/news-section-layout";
import { getDistinctCover } from "@/lib/utils";
import { getDevNewsQuery } from "@/config/dev-news";
import type { ReactNode } from "react";

interface DevArticle {
  id: number;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  image: string;
  time: string;
  comments: number;
  author: string;
  tags: string[];
}

const articles: DevArticle[] = [
  { id: 1, category: "REACT", categoryColor: "bg-sky-600", title: "React 19.2 estavel: useEffectEvent, Activity e novas APIs de formulario", description: "A versao traz melhorias significativas para gerenciamento de efeitos colaterais e estados de UI.", image: getDistinctCover("dev-react-1"), time: "30 min", comments: 289, author: "Ricardo Martins", tags: ["React", "Hooks", "Forms"] },
  { id: 2, category: "RUST", categoryColor: "bg-orange-600", title: "Rust 2026 Edition: async traits estaveis e melhorias no borrow checker", description: "Nova edicao da linguagem traz features aguardadas ha anos pela comunidade de desenvolvedores.", image: getDistinctCover("dev-rust-2"), time: "1h", comments: 198, author: "Daniel Costa", tags: ["Rust", "Systems", "Async"] },
  { id: 3, category: "DEVOPS", categoryColor: "bg-violet-600", title: "Docker Desktop 5.0 integra IA para otimizacao automatica de containers", description: "Novo recurso analisa workloads e sugere configuracoes ideais de recursos.", image: getDistinctCover("dev-devops-3"), time: "2h", comments: 156, author: "Thiago Rocha", tags: ["Docker", "DevOps", "IA"] },
  { id: 4, category: "MOBILE", categoryColor: "bg-emerald-600", title: "Flutter 4.0 adota Dart 4 com macros e pattern matching avancado", description: "Framework mobile do Google ganha ferramentas que aproximam Dart de linguagens como Kotlin e Swift.", image: getDistinctCover("dev-mobile-4"), time: "3h", comments: 134, author: "Juliana Santos", tags: ["Flutter", "Dart", "Mobile"] },
  { id: 5, category: "BACKEND", categoryColor: "bg-amber-600", title: "Bun 2.0 lanca runtime compativel com 99% dos pacotes npm e performance 2x Node", description: "O runtime JavaScript alternativo atinge maturidade para producao em grande escala.", image: getDistinctCover("dev-backend-5"), time: "4h", comments: 312, author: "Paulo Henrique", tags: ["Bun", "JavaScript", "Runtime"] },
  { id: 6, category: "IA", categoryColor: "bg-violet-600", title: "Cursor vs Windsurf vs Copilot: benchmark completo de IDEs com IA em 2026", description: "Comparativo detalhado de produtividade, qualidade de sugestoes e integracao com fluxos de trabalho.", image: getDistinctCover("dev-ai-6"), time: "5h", comments: 567, author: "Marcos Lima", tags: ["IDE", "IA", "Produtividade"] },
];

export function FrameworkNews({ sidebar }: { sidebar?: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <FrameworkNewsContent sidebar={sidebar} />
    </Suspense>
  );
}

function FrameworkNewsContent({ sidebar }: { sidebar?: ReactNode }) {
  const [selected, setSelected] = useState<any | null>(null);
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "all";

  const activeQuery = getDevNewsQuery(topic);

  const { 
    articles: apiNews,
    lastSyncRelative
  } = useNews(activeQuery, "Dev", 12, 1);
  
  const displayArticles = apiNews.length > 0 ? apiNews.map((n: any, i: number) => {
    const mock = articles[i % articles.length];
    return { ...mock, id: n.url || n.id || Math.random().toString(), title: n.title, description: n.description, image: n.image, url: n.url, time: "agora" };
  }) : [];
  const { featuredArticles, remainingArticles } = useNewsRotation(displayArticles, 3);

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
          <FeaturedNewsCarousel label="Notícias de desenvolvimento em destaque">
            {featuredArticles.map((article) => (
              <FeaturedDevCard key={article.id} article={article} onClick={() => article.url ? window.open(article.url, "_blank") : setSelected(article)} />
            ))}
          </FeaturedNewsCarousel>
        }
        list={remainingArticles.length > 0 ? (
          <div className="flex flex-col gap-3">
          {remainingArticles.map((article) => (
            <CompactDevCard key={article.id} article={article} onClick={() => article.url ? window.open(article.url, "_blank") : setSelected(article)} />
          ))}
          </div>
        ) : null}
      />
      <ArticleModal article={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </>
  );
}

function FeaturedDevCard({ article, onClick }: { article: DevArticle; onClick: () => void }) {
  return (
    <article onClick={onClick} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-400/5">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className={`${article.categoryColor} rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider text-white`}>{article.category}</span>
        </div>
      </div>
      <div className="p-4 lg:p-5">
        <h3 className="font-heading text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-emerald-400 lg:text-base">
          <span className="text-balance">{article.title}</span>
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{article.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[10px] font-medium text-emerald-400">{tag}</span>
          ))}
        </div>
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

function CompactDevCard({ article, onClick }: { article: DevArticle; onClick: () => void }) {
  return (
    <article onClick={onClick} className="group flex cursor-pointer gap-4 rounded-xl border border-border bg-card p-3 transition-all duration-300 hover:border-emerald-400/30 hover:shadow-md hover:shadow-emerald-400/5">
      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className={`${article.categoryColor} absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white`}>{article.category}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-emerald-400">{article.title}</h3>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{article.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">{article.author}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            <span className="text-[10px]">{article.time}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-2.5 w-2.5" />
            <span className="text-[10px]">{article.comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
