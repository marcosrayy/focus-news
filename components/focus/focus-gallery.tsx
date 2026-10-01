"use client";

import { useState } from "react";
import { Camera, X } from "lucide-react";

interface GalleryItem {
  src: string;
  alt: string;
  label: string;
  span: string;
  fit?: "cover" | "contain";
}

const galleryItems: GalleryItem[] = [
  {
    src: "/Adriano%20comprando%20a%20microsoft.jpg",
    alt: "Integrante da Focus trabalhando em frente a uma tela de projetos",
    label: "Projetos de tecnologia",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/Mestres%20super%20lendarios.jpg",
    alt: "Integrantes da Focus conversando no estande",
    label: "Encontro no estande Focus",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/Mestre%20supremo%20feliz.jpg",
    alt: "Dois integrantes da Focus posando juntos",
    label: "Equipe Focus",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/mestre%20lendario.jpg",
    alt: "Integrante da Focus em uma conversa de trabalho",
    label: "Bastidores da equipe",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/Davi.jpg",
    alt: "Integrante da Focus em uma reunião",
    label: "Encontro da equipe",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/gisele.jpg",
    alt: "Gisele no estande da empresa",
    label: "Equipe Focus no evento",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/equipe%20maneira.jpeg",
    alt: "Dois integrantes da Focus no estande da empresa",
    label: "Equipe Focus no estande",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/A%20FOCUS%20%C3%89%20%20A%20FOCUS.jpg",
    alt: "Cartões de visita da Focus",
    label: "Identidade Focus",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/Adriano%20negociando%20com%20a%20microsoft.jpg",
    alt: "Integrante da Focus trabalhando diante de um computador",
    label: "Bastidores de tecnologia",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/Adriano%20sendo%20ultra%20humilde.jpg",
    alt: "Integrante da Focus conferindo anotações durante um evento",
    label: "Anotações no evento",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/Chefes%20negociando.jpg",
    alt: "Equipe da Focus conversando com visitantes no estande",
    label: "Conversas no estande",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/Equipe%20maneira%202.jpg",
    alt: "Equipe reunida em um espaço de trabalho",
    label: "Equipe em reunião",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/Equipe.jpg",
    alt: "Integrante da Focus registrando um evento",
    label: "Cobertura do evento",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/chefes.jpg",
    alt: "Dois integrantes da Focus no espaço da empresa",
    label: "Time Focus",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/Rezende%20ultra%20feliz.jpg",
    alt: "Integrante da Focus conversando durante um evento",
    label: "Encontro no evento",
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
