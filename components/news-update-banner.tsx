"use client";

import { Sparkles, RefreshCw } from "lucide-react";

interface NewsUpdateBannerProps {
  hasUpdates: boolean;
  newCount: number;
  onUpdate: () => void;
}

export function NewsUpdateBanner({ hasUpdates, newCount, onUpdate }: NewsUpdateBannerProps) {
  if (!hasUpdates || newCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-bounce">
      <button
        onClick={onUpdate}
        className="flex items-center gap-3 rounded-full border border-primary/30 bg-background/90 px-5 py-3 text-xs font-bold tracking-wider text-primary shadow-glow backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-background md:text-sm active:scale-95"
      >
        <Sparkles className="h-4 w-4 animate-pulse text-primary" />
        <span>
          📰 {newCount} {newCount === 1 ? 'nova notícia disponível' : 'novas notícias disponíveis'}. Clique para atualizar o feed.
        </span>
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
      </button>
    </div>
  );
}
