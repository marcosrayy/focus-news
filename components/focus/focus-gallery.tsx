"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

import { defaultFocusContent, type FocusPhoto } from "@/lib/focus-content";

export function FocusGallery({ images = defaultFocusContent.gallery }: { images?: FocusPhoto[] }) {
  const galleryItems = images;
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lightboxTrackRef = useRef<HTMLDivElement>(null);
  const lightboxScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeLightbox = () => {
    if (lightboxScrollTimer.current) clearTimeout(lightboxScrollTimer.current);
    setLightbox(null);
  };

  useEffect(() => {
    if (lightbox === null || !lightboxTrackRef.current) return;
    lightboxTrackRef.current.scrollLeft = lightbox * lightboxTrackRef.current.clientWidth;
  }, [lightbox]);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-primary" />
        <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
          GALERIA & COBERTURA
        </h2>
        <Camera className="ml-1 h-4 w-4 text-primary" />
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scrollbar-hide sm:grid sm:auto-rows-[180px] sm:grid-cols-4 sm:overflow-visible">
        {galleryItems.map((item, i) => (
          <div
            key={item.id}
            className={`group relative h-44 min-w-[85%] snap-center cursor-pointer overflow-hidden rounded-xl sm:h-auto sm:min-w-0 ${item.span}`}
            onClick={() => setLightbox(i)}
          >
            <img
              src={item.src}
              alt={item.alt}
              className={`h-full w-full ${item.fit === "contain" ? "bg-black object-contain" : "object-cover"} transition-transform duration-500 group-hover:scale-110`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
          onClick={closeLightbox}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-card p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={closeLightbox}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            ref={lightboxTrackRef}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-hide"
            onScroll={(event) => {
              if (lightboxScrollTimer.current) clearTimeout(lightboxScrollTimer.current);
              const track = event.currentTarget;
              lightboxScrollTimer.current = setTimeout(() => {
                const index = Math.round(track.scrollLeft / track.clientWidth);
                setLightbox((current) => current === index ? current : index);
              }, 120);
            }}
          >
            {galleryItems.map((item) => (
              <div key={item.id} className="flex h-full min-w-full snap-center items-center justify-center px-4">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                  onClick={(event) => event.stopPropagation()}
                />
              </div>
            ))}
          </div>
          <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-card/90 px-4 py-2 text-sm font-bold text-foreground backdrop-blur-sm">
            {galleryItems[lightbox]?.label}
          </p>
        </div>
      )}
    </section>
  );
}
