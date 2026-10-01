"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const heroSlides = [
  {
    image: "/focus-tech-summit.jpg",
    title: "Siará Tech Summit 2026 com a Focus Tech",
  },
  {
    image: "/workshop.jpg",
    title: "Focus anuncia expansao para 5 novas capitais em 2026",
  },
  {
    image: "/focus-workshop.jpg",
    title: "Focus Academy forma 500 profissionais em IA Generativa",
  },
  {
    image: "/focus-gallery-3.jpg",
    title: "Focus fecha parceria estrategica com Microsoft para Startups",
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
    [isTransitioning],
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

  return (
    <section className="group relative overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/10] w-full bg-background sm:aspect-[3/1]">
        {/* Slides */}
        <img
          src={heroSlides[0].image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 z-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700 ${
            current === 0 ? "opacity-70" : "opacity-0"
          }`}
        />
        {heroSlides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt={s.title}
            className={`absolute inset-0 z-10 h-full w-full transition-all duration-700 ease-in-out ${
              i === current ? "scale-100 opacity-100" : "scale-105 opacity-0"
            } ${i === 0 ? "object-contain" : "object-cover"}`}
          />
        ))}

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

        {current === 0 && (
          <a
            href="https://beevent.com.br/cart/?event=15057a07-7970-4b24-b656-d4d2e599b950&ticket=65786a55-b195-4a5f-a284-96f374fdf9e9&embed=1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Inscreva-se no Siará Tech Summit"
            title="Inscreva-se no Siará Tech Summit"
            className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-md bg-orange-500/90 text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:bottom-4 sm:right-4"
          >
            <ArrowRight className="h-4 w-4" />
          </a>
        )}

        <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0 sm:gap-2">
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
              {i === current && (
                <span className="absolute inset-[14px] animate-spin rounded-full border border-transparent border-t-primary/60 [animation-duration:6s] sm:inset-[15px]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
