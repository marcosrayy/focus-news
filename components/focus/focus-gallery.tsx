"use client";

import { useState } from "react";
import { Camera, Play, X } from "lucide-react";

const galleryItems = [
  {
    src: "/focus-tedx.jpg",
    alt: "Palestra no TEDx Fortaleza",
    label: "TEDx Fortaleza 2026",
    type: "foto" as const,
    span: "col-span-2 row-span-2",
  },
  {
    src: "/focus-event-1.jpg",
    alt: "Stand na Web Summit",
    label: "Web Summit Rio 2025",
    type: "foto" as const,
    span: "col-span-1 row-span-1",
  },
  {
    src: "/focus-workshop.jpg",
    alt: "Workshop de IA",
    label: "Workshop Focus Labs",
    type: "foto" as const,
    span: "col-span-1 row-span-1",
  },
  {
    src: "/focus-gallery-1.jpg",
    alt: "Bastidores do evento",
    label: "Bastidores - Startup Summit",
    type: "video" as const,
    span: "col-span-1 row-span-1",
  },
  {
    src: "/focus-gallery-2.jpg",
    alt: "Networking cocktail",
    label: "Networking Night Focus",
    type: "foto" as const,
    span: "col-span-1 row-span-1",
  },
  {
    src: "/focus-gallery-3.jpg",
    alt: "Panel discussion",
    label: "Painel: Futuro da IA",
    type: "foto" as const,
    span: "col-span-2 row-span-1",
  },
];

export function FocusGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-primary" />
        <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
          GALERIA & COBERTURA
        </h2>
        <Camera className="ml-1 h-4 w-4 text-primary" />
      </div>

      <div className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-4">
        {galleryItems.map((item, i) => (
          <div
            key={item.label}
            className={`group relative cursor-pointer overflow-hidden rounded-xl ${item.span}`}
            onClick={() => setLightbox(i)}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30">
                  <Play className="h-4 w-4 fill-current" />
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-xs font-bold text-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-card p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={galleryItems[lightbox].src}
            alt={galleryItems[lightbox].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-card/90 px-4 py-2 text-sm font-bold text-foreground backdrop-blur-sm">
            {galleryItems[lightbox].label}
          </p>
        </div>
      )}
    </section>
  );
}
