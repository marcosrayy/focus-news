"use client";

import { Clock, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { formatRelativeTime } from "@/lib/news-service";
import { useNewsRotation } from "@/hooks/use-news-rotation";
import { NewsSectionLayout } from "@/components/news-section-layout";
import type { ReactNode } from "react";

export function TradeArticles({ sidebar }: { sidebar?: ReactNode }) {
  const { 
    articles: news,
    lastSyncRelative
  } = useNews("Bolsa de valores OR Mercado Financeiro OR Ibovespa OR B3 OR Mercado Tech OR Fintech OR Fintechs", "Trade", 15);
  
  const articlesToRender = news.length > 0 ? news : [];
  const { featuredArticles, remainingArticles } = useNewsRotation(articlesToRender);

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
            <FeaturedTradeCard key={article.id} article={article} onClick={() => window.open(article.url, "_blank")} />
          ))}
          </div>
        }
        list={
          <div className="flex flex-col gap-3">
          {remainingArticles.slice(0, 9).map((article) => (
            <CompactTradeCard key={article.id} article={article} onClick={() => window.open(article.url, "_blank")} />
          ))}
          </div>
        }
      />
    </>
  );
}

function getMockTicker(category: string) {
  const isPositive = Math.random() > 0.5;
  const change = (Math.random() * 5).toFixed(1);
  return {
    ticker: category ? category.substring(0, 4).toUpperCase() : "MERC",
    tickerChange: isPositive ? `+${change}%` : `-${change}%`,
    isPositive
  };
}

function FeaturedTradeCard({ article, onClick }: { article: any; onClick: () => void }) {
  const { ticker, tickerChange, isPositive } = getMockTicker(article.category || "");
  const time = formatRelativeTime(article.publishedAt);
  const comments = Math.floor(Math.random() * 500);

  return (
    <article onClick={onClick} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-400/5">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={article.image } alt={article.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <span className="bg-emerald-600 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">{article.category || "ACOES"}</span>
        </div>
        <div className="absolute bottom-3 right-3 rounded-lg border border-emerald-500/30 bg-background/80 px-3 py-1.5 backdrop-blur-sm">
          <p className="font-heading text-xs font-bold text-foreground">{ticker}</p>
          <p className={`text-[10px] font-bold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
            {isPositive ? <TrendingUp className="mr-0.5 inline h-2.5 w-2.5" /> : <TrendingDown className="mr-0.5 inline h-2.5 w-2.5" />}
            {tickerChange}
          </p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-emerald-400 lg:text-base">
          <span className="text-balance">{article.title}</span>
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{article.description}</p>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">{article.author}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[10px]">{time}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span className="text-[10px]">{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactTradeCard({ article, onClick }: { article: any; onClick: () => void }) {
  const { ticker, tickerChange, isPositive } = getMockTicker(article.category || "");
  const time = formatRelativeTime(article.publishedAt);

  return (
    <article onClick={onClick} className="group flex cursor-pointer gap-4 rounded-xl border border-border bg-card p-3 transition-all duration-300 hover:border-emerald-400/30 hover:shadow-md hover:shadow-emerald-400/5">
      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
        <img src={article.image } alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="bg-emerald-600 absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase">{article.category || "MERC"}</span>
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
            <span className="text-[10px]">{time}</span>
          </div>
          <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
            {ticker} {tickerChange}
          </span>
        </div>
      </div>
    </article>
  );
}
