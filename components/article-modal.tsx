"use client";

import { Clock, MessageSquare, Share2, Bookmark, User, TrendingUp, Eye } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface ArticleModalData {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  image?: string;
  time: string;
  comments: number;
  author: string;
}

interface ArticleModalProps {
  article: ArticleModalData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticleModal({ article, open, onOpenChange }: ArticleModalProps) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] gap-0 overflow-y-auto border-border bg-card p-0 sm:max-w-4xl">
        {/* Full-width cover image */}
        {article.image && (
          <div className="relative h-56 w-full overflow-hidden sm:h-72 md:h-96">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

            {/* Category badge on image */}
            <div className="absolute left-5 top-5 flex items-center gap-2">
              <span
                className={`${article.categoryColor} rounded-lg px-4 py-1.5 text-[11px] font-bold tracking-wider text-white shadow-lg`}
              >
                {article.category}
              </span>
            </div>

            {/* Reading time pill on image */}
            <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 backdrop-blur-md">
              <Eye className="h-3.5 w-3.5 text-foreground" />
              <span className="text-[11px] font-semibold text-foreground">4 min de leitura</span>
            </div>

            {/* Title overlaying bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <DialogHeader className="gap-0">
                <DialogTitle className="font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
                  <span className="text-balance">{article.title}</span>
                </DialogTitle>
              </DialogHeader>
            </div>
          </div>
        )}

        {/* Content body */}
        <div className="flex flex-col gap-5 p-5 sm:p-7">
          {/* Fallback header when no image */}
          {!article.image && (
            <DialogHeader className="gap-3">
              <span
                className={`${article.categoryColor} w-fit rounded-lg px-4 py-1.5 text-[11px] font-bold tracking-wider text-white`}
              >
                {article.category}
              </span>
              <DialogTitle className="font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
                <span className="text-balance">{article.title}</span>
              </DialogTitle>
            </DialogHeader>
          )}

          {/* Author bar */}
          <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{article.author}</p>
                <p className="text-xs text-muted-foreground">Redacao Focus News</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">{article.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="text-xs">{article.comments} comentarios</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Em alta</span>
              </div>
            </div>
          </div>

          {/* Lead / Description */}
          <DialogDescription className="text-base font-medium leading-relaxed text-foreground/80">
            {article.description}
          </DialogDescription>

          {/* Article body */}
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-foreground/80">
              Segundo especialistas ouvidos pela redacao, os desdobramentos deste
              acontecimento devem impactar significativamente o mercado nos
              proximos meses. Analistas apontam que a tendencia ja era observada
              desde o inicio do trimestre, mas a confirmacao oficial
              surpreendeu ate os mais otimistas.
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              {'"'}O cenario atual reflete uma transformacao estrutural que vai
              muito alem de um simples movimento de mercado{'"'}, afirma o
              especialista consultado. {'"'}Estamos diante de uma mudanca de
              paradigma que pode redefinir como o setor opera
              globalmente.{'"'}
            </p>

            {/* Highlight quote block */}
            <blockquote className="my-2 border-l-4 border-primary bg-primary/5 py-4 pl-5 pr-4">
              <p className="text-sm font-medium italic leading-relaxed text-foreground">
                {'"'}As projecoes para o proximo trimestre indicam um crescimento de
                47% no volume de operacoes, atingindo patamares que nao eram
                registrados desde 2021.{'"'}
              </p>
              <cite className="mt-2 block text-xs font-semibold not-italic text-primary">
                -- Analise Focus News Research
              </cite>
            </blockquote>

            <p className="text-sm leading-relaxed text-foreground/80">
              Os dados mais recentes indicam que o volume de operacoes
              relacionadas cresceu significativamente nas ultimas semanas. A
              expectativa e de que novos desdobramentos sejam anunciados em
              breve, potencialmente ampliando ainda mais o alcance destas
              mudancas no cenario global.
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              Especialistas recomendam atencao redobrada aos indicadores
              macroeconomicos nas proximas semanas, ja que a convergencia de
              fatores pode criar tanto oportunidades quanto riscos para
              investidores posicionados neste segmento.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="text-xs font-semibold text-muted-foreground">Tags:</span>
            {["Mercado", "Analise", "Tendencias", "Investimentos"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                <Share2 className="h-3.5 w-3.5" />
                Compartilhar
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Bookmark className="h-3.5 w-3.5" />
                Salvar
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Publicado por Focus News
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
