"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const heroSlides = [
  {
    image: "/focus-tedx.jpg",
    badge: "DESTAQUE INSTITUCIONAL",
    category: "EVENTO PRINCIPAL",
    title: "Focus presente no TEDx Fortaleza 2026",
    description:
      "A Focus marcou presenca no TEDx Fortaleza com uma palestra sobre o futuro da automacao inteligente e o impacto da IA no ecossistema de startups brasileiro.",
    cta: "Saiba Mais",
  },
  {
    image: "/focus-event-1.jpg",
    badge: "BREAKING",
    category: "EXPANSAO",
    title: "Focus anuncia expansao para 5 novas capitais em 2026",
    description:
      "Com investimento de R$ 15 milhoes, a Focus levara sua plataforma de inovacao para Belo Horizonte, Curitiba, Recife, Salvador e Brasilia ate o final do ano.",
    cta: "Saiba Mais",
  },
  {
    image: "/focus-workshop.jpg",
    badge: "EDUCACAO",
    category: "PROGRAMA DE CAPACITACAO",
    title: "Focus Academy forma 500 profissionais em IA Generativa",
    description:
      "O programa intensivo de 12 semanas capacitou profissionais de 120 empresas em ferramentas de IA generativa aplicadas ao mercado corporativo brasileiro.",
    cta: "Saiba Mais",
  },
  {
    image: "/focus-gallery-3.jpg",
    badge: "PARCERIA",
    category: "COLABORACAO GLOBAL",
    title: "Focus fecha parceria estrategica com Microsoft para Startups",
    description:
      "Acordo garante acesso a creditos Azure, mentoria tecnica e go-to-market para as startups aceleradas pelo programa Focus Ventures.",
    cta: "Saiba Mais",
  },
];

export function HeroFocus() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="group relative overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/10] w-full sm:aspect-[3/1]">
        {/* Slides */}
        {heroSlides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt={s.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${
              i === current
                ? "scale-100 opacity-100"
                : "scale-105 opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2 lg:left-8 lg:top-8">
          <span
            key={current}
            className="animate-in fade-in slide-in-from-left-2 rounded-md bg-primary px-2.5 py-1 text-[9px] font-bold tracking-[0.1em] text-primary-foreground shadow-lg shadow-primary/30 duration-500 sm:rounded-lg sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-wider"
          >
            {slide.badge}
          </span>
        </div>

        {/* Nav Arrows */}
        <button
          onClick={prev}
          aria-label="Noticia anterior"
          className="group/nav absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 lg:left-4"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-background/70 backdrop-blur-sm transition-colors group-hover/nav:bg-primary group-hover/nav:text-primary-foreground">
            <ChevronLeft className="h-3.5 w-3.5" />
          </span>
        </button>
        <button
          onClick={next}
          aria-label="Proxima noticia"
          className="group/nav absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 lg:right-4"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-background/70 backdrop-blur-sm transition-colors group-hover/nav:bg-primary group-hover/nav:text-primary-foreground">
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-8">
          <span
            key={`cat-${current}`}
            className="animate-in fade-in slide-in-from-bottom-1 mb-2 inline-block text-xs font-bold tracking-[0.2em] text-primary duration-500"
          >
            {slide.category}
          </span>
          <h2
            key={`title-${current}`}
            className="animate-in fade-in slide-in-from-bottom-2 line-clamp-3 font-heading text-lg font-bold leading-tight text-foreground duration-500 sm:line-clamp-none sm:text-2xl lg:text-4xl xl:text-5xl"
          >
            <span className="text-balance">{slide.title}</span>
          </h2>
          <p
            key={`desc-${current}`}
            className="animate-in fade-in slide-in-from-bottom-3 mt-3 hidden max-w-2xl text-sm leading-relaxed text-muted-foreground duration-700 sm:block lg:text-base"
          >
            {slide.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-4">
            <button className="flex min-h-11 w-24 items-center justify-center rounded-lg px-0 py-0 text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto sm:rounded-xl sm:bg-primary sm:px-6 sm:py-3 sm:text-sm sm:hover:shadow-lg sm:hover:shadow-primary/30">
              <span className="pointer-events-none inline-flex h-8 w-24 items-center justify-center gap-1 rounded-lg bg-primary px-2.5 text-[10px] font-semibold transition-colors hover:bg-primary/90 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-none sm:px-0 sm:text-sm sm:font-bold sm:hover:bg-transparent">
                {slide.cta}
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </span>
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-0 sm:gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir para noticia ${i + 1}`}
                  className="group/dot relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 sm:h-11 sm:w-11"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 sm:h-2 sm:w-2 ${
                      i === current
                        ? "scale-100 bg-primary shadow-md shadow-primary/40"
                        : "scale-75 bg-muted-foreground/40 hover:scale-100 hover:bg-muted-foreground"
                    }`}
                  />
                  {/* Progress ring on active */}
                  {i === current && (
                    <span className="absolute inset-[14px] animate-spin rounded-full border border-transparent border-t-primary/60 [animation-duration:6s] sm:inset-[15px]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
