"use client";

import { useState } from "react";
import { Clock, MessageSquare, Bookmark, Handshake, Rocket, Users, Code, TrendingUp } from "lucide-react";
import { ArticleModal, type ArticleModalData } from "@/components/article-modal";

const newsItems = [
  {
    title: "Focus fecha contrato com Grupo Mateus para transformacao digital completa",
    description:
      "Parceria estrategica inclui automacao de processos, desenvolvimento de plataforma de e-commerce e implementacao de IA para gestao de estoque em mais de 200 unidades.",
    category: "Novo Contrato",
    categoryColor: "bg-emerald-600",
    icon: Handshake,
    time: "3h",
    comments: 42,
    author: "Comunicacao Focus",
    image: "/news-fintech.jpg",
  },
  {
    title: "Lancamento: Focus AI Assistant - nosso primeiro produto SaaS de IA",
    description:
      "Apos 8 meses de desenvolvimento, a Focus lanca sua plataforma de assistentes de IA personalizados para empresas. Solucao ja possui 15 clientes em fase beta.",
    category: "Lancamento",
    categoryColor: "bg-primary",
    icon: Rocket,
    time: "1d",
    comments: 87,
    author: "Equipe de Produto",
    image: "/news-ai-chip.jpg",
  },
  {
    title: "Focus expande equipe e abre 25 novas vagas em tecnologia e design",
    description:
      "Com o crescimento de 340% no ultimo ano, a empresa busca desenvolvedores full-stack, designers UX/UI, engenheiros de IA e especialistas em automacao.",
    category: "Expansao",
    categoryColor: "bg-blue-600",
    icon: Users,
    time: "2d",
    comments: 63,
    author: "RH Focus",
    image: "/focus-workshop.jpg",
  },
  {
    title: "Parceria estrategica com AWS para programa de aceleracao de startups",
    description:
      "Focus torna-se parceira oficial da AWS no Nordeste, oferecendo creditos de cloud computing e mentoria tecnica para startups do ecossistema regional.",
    category: "Parceria",
    categoryColor: "bg-amber-600",
    icon: Handshake,
    time: "3d",
    comments: 35,
    author: "Parcerias Focus",
    image: "/news-cloud.jpg",
  },
  {
    title: "Focus OS v3.0: nova versao do sistema de gestao interna com modulo de IA",
    description:
      "Atualizacao traz automacao de propostas comerciais, dashboard preditivo e integracao nativa com plataformas de comunicacao.",
    category: "Atualizacao",
    categoryColor: "bg-violet-600",
    icon: Code,
    time: "4d",
    comments: 28,
    author: "Time de Engenharia",
    image: "/news-cyber.jpg",
  },
  {
    title: "Focus registra crescimento de 340% em receita recorrente no ultimo trimestre",
    description:
      "Resultado coloca a empresa como uma das startups de crescimento mais rapido do ecossistema tech do Nordeste brasileiro.",
    category: "Resultado",
    categoryColor: "bg-emerald-600",
    icon: TrendingUp,
    time: "5d",
    comments: 51,
    author: "Financeiro Focus",
    image: "/news-startup.jpg",
  },
];

export function CompanyNews() {
  const [selectedArticle, setSelectedArticle] = useState<ArticleModalData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (article: ArticleModalData) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-primary" />
        <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
          NOTICIAS DA EMPRESA
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {newsItems.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="group flex cursor-pointer gap-4 rounded-xl border border-border bg-card p-3 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
              onClick={() => openModal(item)}
            >
              <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-44">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1.5">
                <div className="flex items-center gap-2">
                  <span className={`${item.categoryColor} flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold tracking-wider text-white`}>
                    <Icon className="h-2.5 w-2.5" />
                    {item.category}
                  </span>
                  <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[8px] font-bold tracking-wider text-primary">
                    OFICIAL FOCUS
                  </span>
                </div>
                <h3 className="line-clamp-2 font-heading text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="line-clamp-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="text-[11px] font-semibold text-foreground">{item.author}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-[11px]">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span className="text-[11px]">{item.comments}</span>
                  </div>
                  <button
                    className="ml-auto text-muted-foreground transition-colors hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Salvar"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ArticleModal article={selectedArticle} open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}
