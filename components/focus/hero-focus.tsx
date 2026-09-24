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
    cta: "Ver Cobertura Completa",
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
    cta: "Conhecer o Programa",
  },
  {
    image: "/focus-gallery-3.jpg",
    badge: "PARCERIA",
    category: "COLABORACAO GLOBAL",
    title: "Focus fecha parceria estrategica com Microsoft para Startups",
    description:
      "Acordo garante acesso a creditos Azure, mentoria tecnica e go-to-market para as startups aceleradas pelo programa Focus Ventures.",
    cta: "Detalhes da Parceria",
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
      <div className="relative aspect-[3/1] w-full">
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
            className="animate-in fade-in slide-in-from-left-2 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold tracking-wider text-primary-foreground shadow-lg shadow-primary/30 duration-500"
          >
            {slide.badge}
          </span>
        </div>

        {/* Nav Arrows */}
        <button
          onClick={prev}
          aria-label="Noticia anterior"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/40 bg-background/60 p-2 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 lg:left-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Proxima noticia"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/40 bg-background/60 p-2 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 lg:right-4"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
          <span
            key={`cat-${current}`}
            className="animate-in fade-in slide-in-from-bottom-1 mb-2 inline-block text-xs font-bold tracking-[0.2em] text-primary duration-500"
          >
            {slide.category}
          </span>
          <h2
            key={`title-${current}`}
            className="animate-in fade-in slide-in-from-bottom-2 font-heading text-2xl font-bold leading-tight text-foreground duration-500 lg:text-4xl xl:text-5xl"
          >
            <span className="text-balance">{slide.title}</span>
          </h2>
          <p
            key={`desc-${current}`}
            className="animate-in fade-in slide-in-from-bottom-3 mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground duration-700 lg:text-base"
          >
            {slide.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/30">
              {slide.cta}
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir para noticia ${i + 1}`}
                  className="group/dot relative h-2.5 w-2.5 rounded-full transition-all duration-300"
                >
                  <span
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      i === current
                        ? "scale-100 bg-primary shadow-md shadow-primary/40"
                        : "scale-75 bg-muted-foreground/40 hover:scale-100 hover:bg-muted-foreground"
                    }`}
                  />
                  {/* Progress ring on active */}
                  {i === current && (
                    <span className="absolute -inset-1 animate-spin rounded-full border border-transparent border-t-primary/60 [animation-duration:6s]" />
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
