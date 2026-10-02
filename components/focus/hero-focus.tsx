"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

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
    image: "/focus-blog.jpg",
    title: "Focus Tech Blog: conteúdo sobre tecnologia e inovação",
  },
  {
    image: "/comunidade-focus.jpg",
    title: "Comunidade Focus Tech",
  },
];

export function HeroFocus() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gestureStart = useRef<{ x: number; y: number } | null>(null);

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
    <section className="group relative overflow-hidden rounded-2xl border border-border/60 shadow-card">
      <div
        className="relative aspect-[8/3] w-full touch-pan-y bg-black sm:aspect-[3/1]"
        onPointerDown={(event) => {
          if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
          gestureStart.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = gestureStart.current;
          gestureStart.current = null;
          if (!start) return;

          const deltaX = event.clientX - start.x;
          const deltaY = event.clientY - start.y;
          if (Math.abs(deltaX) >= 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            deltaX < 0 ? next() : prev();
          }
        }}
        onPointerCancel={() => {
          gestureStart.current = null;
        }}
      >
        {heroSlides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt={s.title}
            className={`absolute inset-0 z-10 h-full w-full transition-all duration-700 ease-in-out ${
              i === current ? "scale-100 opacity-100" : "scale-105 opacity-0"
            } object-cover`}
          />
        ))}

        {current === 0 ? (
          <a
            href="https://beevent.com.br/cart/?event=15057a07-7970-4b24-b656-d4d2e599b950&ticket=65786a55-b195-4a5f-a284-96f374fdf9e9&embed=1"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 z-20 hidden min-h-9 items-center justify-center rounded-md border border-foreground/20 bg-background/85 px-4 text-xs font-semibold text-foreground shadow-lg backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
          >
            Saiba Mais
          </a>
        ) : (
          <button
            type="button"
            className="absolute right-4 top-4 z-20 hidden min-h-9 items-center justify-center rounded-md border border-foreground/20 bg-background/85 px-4 text-xs font-semibold text-foreground shadow-lg backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
          >
            Saiba Mais
          </button>
        )}

        {/* Nav Arrows */}
        <button
          onClick={prev}
          aria-label="Noticia anterior"
          className="group/nav absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground transition-all duration-300 sm:flex sm:opacity-0 sm:group-hover:opacity-100 lg:left-4"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-background/70 backdrop-blur-sm transition-colors group-hover/nav:bg-primary group-hover/nav:text-primary-foreground">
            <ChevronLeft className="h-3.5 w-3.5" />
          </span>
        </button>
        <button
          onClick={next}
          aria-label="Proxima noticia"
          className="group/nav absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground transition-all duration-300 sm:flex sm:opacity-0 sm:group-hover:opacity-100 lg:right-4"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-background/70 backdrop-blur-sm transition-colors group-hover/nav:bg-primary group-hover/nav:text-primary-foreground">
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>

        <div className="absolute bottom-0 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 sm:flex">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir para noticia ${i + 1}`}
              className="group/dot relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300"
            >
              <span
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "scale-100 bg-primary shadow-md shadow-primary/40"
                    : "scale-75 bg-muted-foreground/40 hover:scale-100 hover:bg-muted-foreground"
                }`}
              />
              {i === current && (
                <span className="absolute inset-[15px] animate-spin rounded-full border border-transparent border-t-primary/60 [animation-duration:6s]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-12 items-center justify-between gap-1 border-t border-border bg-background px-2 sm:hidden">
        <button
          onClick={prev}
          aria-label="Notícia anterior"
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-secondary/50 text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir para notícia ${i + 1}`}
              className="flex h-7 w-6 shrink-0 items-center justify-center"
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted-foreground/40"}`} />
            </button>
          ))}
        </div>
        {current === 0 ? (
          <a
            href="https://beevent.com.br/cart/?event=15057a07-7970-4b24-b656-d4d2e599b950&ticket=65786a55-b195-4a5f-a284-96f374fdf9e9&embed=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-md bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Saiba Mais
          </a>
        ) : (
          <button
            type="button"
            className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-md bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Saiba Mais
          </button>
        )}
        <button
          onClick={next}
          aria-label="Próxima notícia"
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-secondary/50 text-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
