"use client";

import { useState } from "react";
import { useNews } from "@/hooks/useNews";
import { Clock, MessageSquare, Bookmark, Brain, Bot, Wand2, Eye, Mic, FileCode } from "lucide-react";
import { ArticleModal, type ArticleModalData } from "@/components/article-modal";
import { useNewsRotation } from "@/hooks/use-news-rotation";
import { NewsSectionLayout } from "@/components/news-section-layout";
import type { ReactNode } from "react";

interface AIArticle {
  id: number | string;
  category: string;
  categoryColor: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  time: string;
  comments: number;
  author: string;
}

const articles: AIArticle[] = [
  { id: 1, category: "LLMs", categoryColor: "bg-violet-600", icon: <Brain className="h-3 w-3" />, title: "Claude 4 Opus introduz raciocinio em cadeia e memoria de longo prazo para conversas", description: "A Anthropic lanca modelo que mantem contexto de ate 1 milhao de tokens com fidelidade de 98%.", image: "/news-ai-chip.jpg", time: "20 min", comments: 456, author: "Marcos Vieira" },
  { id: 2, category: "AGENTES", categoryColor: "bg-emerald-600", icon: <Bot className="h-3 w-3" />, title: "Agentes de IA autonomos conseguem executar tarefas complexas de DevOps sem supervisao", description: "Estudo mostra que agentes ja solucionam 73% dos incidentes em producao de forma autonoma.", image: "/news-focus.jpg", time: "1h", comments: 321, author: "Fernanda Lopes" },
  { id: 3, category: "GERACAO", categoryColor: "bg-amber-600", icon: <Wand2 className="h-3 w-3" />, title: "Sora 2.0 gera videos cinematograficos de 10 minutos com consistencia temporal perfeita", description: "O modelo de video da OpenAI agora aceita scripts complexos e mantem personagens consistentes.", image: "/news-focus.jpg", time: "2h", comments: 789, author: "Gabriel Santos" },
  { id: 4, category: "VISAO", categoryColor: "bg-sky-600", icon: <Eye className="h-3 w-3" />, title: "Novo modelo de visao computacional detecta microplasticos em oceanos via satelite", description: "Tecnologia de IA identifica concentracoes de poluicao com resolucao de 50cm a partir do espaco.", image: "/news-focus.jpg", time: "3h", comments: 198, author: "Dra. Lucia Campos" },
  { id: 5, category: "VOZ", categoryColor: "bg-rose-600", icon: <Mic className="h-3 w-3" />, title: "ElevenLabs lanca clonagem de voz em tempo real com latencia de 50ms para traducao", description: "Sistema permite videoconferencias em 40 idiomas mantendo a voz original do falante.", image: "/news-focus.jpg", time: "4h", comments: 267, author: "Ana Paula Mota" },
  { id: 6, category: "CODIGO", categoryColor: "bg-violet-600", icon: <FileCode className="h-3 w-3" />, title: "Devin 2.0 completa projetos de software inteiros com 89% de aceitacao em code review", description: "O engenheiro de software IA da Cognition alcanca novo patamar em benchmarks SWE-Bench.", image: "/news-focus.jpg", time: "5h", comments: 543, author: "Pedro Nogueira" },
];

export function AITools({ sidebar }: { sidebar?: ReactNode }) {
  const [selected, setSelected] = useState<any | null>(null);
  const { 
    articles: apiNews, 
    lastSyncRelative 
  } = useNews("Inteligencia Artificial OR IA OR ChatGPT OR OpenAI OR Plataformas de IA OR Tech Mundo OR Noticia de IA", "IA", 18);
  
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featuredArticles.map((article) => (
            <FeaturedAICard key={article.id} article={article} onClick={() => article.url ? window.open(article.url, "_blank") : setSelected(article)} />
          ))}
          </div>
        }
        list={
          <div className="flex flex-col gap-3">
          {remainingArticles.map((article) => (
            <CompactAICard key={article.id} article={article} onClick={() => article.url ? window.open(article.url, "_blank") : setSelected(article)} />
          ))}
          </div>
        }
      />
      <ArticleModal article={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </>
  );
}

function FeaturedAICard({ article, onClick }: { article: AIArticle; onClick: () => void }) {
  return (
    <article onClick={onClick} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-400/5">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className={`${article.categoryColor} flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider text-white`}>
            {article.icon}
            {article.category}
          </span>
        </div>
        <button onClick={(e) => e.stopPropagation()} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/20 bg-background/40 text-foreground/60 backdrop-blur-sm transition-all duration-300 hover:border-violet-400 hover:text-violet-400">
          <Bookmark className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-violet-400 lg:text-base">
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

function CompactAICard({ article, onClick }: { article: AIArticle; onClick: () => void }) {
  return (
    <article onClick={onClick} className="group flex cursor-pointer gap-4 rounded-xl border border-border bg-card p-3 transition-all duration-300 hover:border-violet-400/30 hover:shadow-md hover:shadow-violet-400/5">
      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className={`${article.categoryColor} absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white`}>
          {article.icon}
          {article.category}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-violet-400">{article.title}</h3>
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
