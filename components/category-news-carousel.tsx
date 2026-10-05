"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { getDistinctCover } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";

const categoryContent = {
  home: {
    category: "Tecnologia",
    query: "Tecnologia OR Empreendedorismo OR IA",
    label: "DESTAQUE",
    stories: [
      ["Tecnologia e inteligência artificial aceleram a transformação dos negócios", "Empresas ampliam o uso de novas ferramentas para ganhar produtividade e abrir mercados."],
      ["Startups brasileiras atraem atenção de investidores", "Novas rodadas reforçam o potencial de inovação e crescimento do ecossistema nacional."],
      ["Mercado acompanha decisões que podem mudar o cenário econômico", "Indicadores e políticas públicas seguem no radar de empresas e investidores."],
      ["Inovação aproxima pesquisa, empresas e novos produtos", "Projetos de diferentes setores mostram como ideias se transformam em soluções práticas."],
    ],
  },
  tecnologia: {
    category: "Tecnologia",
    query: "Hardware OR Processador OR Inovacao OR Noticias Tech",
    label: "TECNOLOGIA",
    stories: [
      ["Novos processadores ampliam a disputa por desempenho", "Fabricantes investem em chips mais eficientes para computadores e dispositivos móveis."],
      ["Big Techs aceleram investimentos em infraestrutura de inteligência artificial", "Data centers e chips especializados ganham espaço nas estratégias das empresas."],
      ["Dispositivos conectados recebem recursos mais inteligentes", "Atualizações de software e sensores ampliam as possibilidades de uso no cotidiano."],
      ["Segurança digital vira prioridade em produtos e serviços", "Empresas reforçam a proteção de dados diante do avanço de ameaças online."],
    ],
  },
  dev: {
    category: "Dev",
    query: "Desenvolvimento de software OR programação OR frameworks OR ferramentas para desenvolvedores",
    label: "DESENVOLVIMENTO",
    stories: [
      ["Frameworks modernos simplificam a criação de aplicações web", "Novas ferramentas buscam acelerar entregas sem abrir mão de desempenho."],
      ["Desenvolvedores adotam assistentes de IA em seus fluxos de trabalho", "Recursos de geração e revisão de código passam a apoiar equipes de software."],
      ["Arquiteturas serverless e edge avançam em projetos digitais", "A distribuição de aplicações pode reduzir latência e simplificar operações."],
      ["Segurança de dependências entra na rotina de desenvolvimento", "Equipes automatizam verificações para identificar riscos mais cedo."],
    ],
  },
  startups: {
    category: "Startups",
    query: "Startups OR empreendedorismo OR venture capital OR investimentos em startups",
    label: "STARTUPS",
    stories: [
      ["Startups de tecnologia buscam novas rodadas de investimento", "Fundadores apresentam estratégias de crescimento em um mercado mais seletivo."],
      ["Fintechs ampliam soluções para empresas e consumidores", "Pagamentos e serviços financeiros digitais seguem atraindo novos negócios."],
      ["Aceleradoras apostam em negócios com potencial de escala", "Programas conectam empreendedores a mentores, clientes e investidores."],
      ["Startups brasileiras expandem operações para outros mercados", "Empresas exploram novas parcerias para levar seus produtos além do país."],
    ],
  },
  economia: {
    category: "Economia",
    query: "Economia OR mercado financeiro OR Ibovespa OR inflação OR juros",
    label: "ECONOMIA",
    stories: [
      ["Juros e inflação seguem no centro das expectativas do mercado", "Investidores acompanham indicadores que podem orientar os próximos passos da economia."],
      ["Bolsa brasileira reage ao cenário internacional", "Ações de diferentes setores refletem mudanças no apetite por risco."],
      ["Câmbio acompanha decisões econômicas e fluxo global", "O comportamento do dólar influencia empresas, comércio e investimentos."],
      ["Criptomoedas mantêm investidores atentos à volatilidade", "Ativos digitais respondem a novidades regulatórias e movimentos globais."],
    ],
  },
  ia: {
    category: "IA",
    query: "Inteligência Artificial OR IA OR ChatGPT OR OpenAI OR modelos de linguagem",
    label: "INTELIGÊNCIA ARTIFICIAL",
    stories: [
      ["Modelos de inteligência artificial ampliam recursos multimodais", "Sistemas combinam texto, imagem e áudio para atender novas aplicações."],
      ["Agentes de IA começam a automatizar tarefas empresariais", "Companhias testam ferramentas capazes de executar etapas de processos digitais."],
      ["Governança e segurança ganham espaço no debate sobre IA", "Empresas buscam equilibrar inovação, transparência e proteção de dados."],
      ["Novos modelos generativos disputam espaço no mercado", "Desempenho, custo e acesso orientam a adoção pelas organizações."],
    ],
  },
  business: {
    category: "Business",
    query: "Business OR negócios OR estratégia empresarial OR liderança corporativa",
    label: "BUSINESS",
    stories: [
      ["Empresas aceleram projetos de automação para elevar produtividade", "Lideranças avaliam como integrar tecnologia às operações e às equipes."],
      ["Estratégias de crescimento priorizam eficiência e sustentabilidade", "Negócios buscam expandir com foco em resultados de longo prazo."],
      ["Lideranças redesenham modelos de trabalho e gestão", "Novas práticas tentam aproximar inovação, talentos e execução."],
      ["Mercado B2B investe em serviços digitais especializados", "Soluções de software apoiam empresas na modernização de seus processos."],
    ],
  },
  trade: {
    category: "Trade",
    query: "Mercado Financeiro OR Bolsa de Valores OR Ibovespa OR ações OR trading",
    label: "TRADE & MERCADOS",
    stories: [
      ["Ibovespa acompanha juros e fluxo de capital estrangeiro", "Investidores avaliam indicadores locais e o cenário econômico global."],
      ["Dólar e contratos de juros movimentam o pregão", "Dados econômicos influenciam as expectativas de curto prazo dos traders."],
      ["Ações de tecnologia seguem no radar dos investidores", "Resultados corporativos e inovação ajudam a definir o apetite por risco."],
      ["Criptoativos refletem mudanças no mercado global", "Volatilidade e decisões regulatórias continuam influenciando os preços."],
    ],
  },
  inovacao: {
    category: "Inovação",
    query: "Inovação OR inovação tecnológica OR pesquisa e desenvolvimento OR novos negócios",
    label: "INOVAÇÃO",
    stories: [
      ["Novas soluções aproximam pesquisa e necessidades do mercado", "Empresas e centros de pesquisa colaboram em projetos de impacto."],
      ["Tecnologias limpas impulsionam iniciativas em diferentes setores", "Energia e eficiência estão entre os focos de novos negócios."],
      ["Empreendedores experimentam modelos de negócio inovadores", "Produtos digitais abrem caminhos para atender públicos e demandas emergentes."],
      ["Parcerias fortalecem o ecossistema de inovação", "Organizações unem conhecimento, investimento e capacidade de execução."],
    ],
  },
} as const;

type CategoryKey = keyof typeof categoryContent;

interface CategoryNewsCarouselProps {
  category: CategoryKey;
}

export function CategoryNewsCarousel({ category }: CategoryNewsCarouselProps) {
  const config = categoryContent[category];
  const { articles } = useNews(config.query, config.category, 4);
  const [current, setCurrent] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const fallbackArticles = useMemo<NewsArticle[]>(
    () => config.stories.map(([title, description], index) => ({
      id: `${category}-feature-${index + 1}`,
      title,
      description,
      content: description,
      image: getDistinctCover(`${category}-feature-${index + 1}`),
      source: "Focus News",
      author: "Focus News",
      publishedAt: "",
      url: "#",
      category: config.category,
    })),
    [category, config],
  );
  const slides = useMemo(
    () => [
      ...articles.slice(0, 4),
      ...fallbackArticles.slice(articles.length, 4),
    ],
    [articles, fallbackArticles],
  );

  const goTo = useCallback((index: number) => {
    const nextIndex = (index + slides.length) % slides.length;
    setCurrent(nextIndex);
    const track = mobileTrackRef.current;
    if (track?.clientWidth) {
      track.scrollTo({ left: nextIndex * track.clientWidth, behavior: "smooth" });
    }
  }, [slides.length]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [current, slides.length]);

  const renderSlide = (article: NewsArticle, index: number) => {
    const content = (
      <>
        <img
          src={article.image || getDistinctCover(`${category}-feature-${index + 1}`)}
          alt={article.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-10 sm:left-10 sm:right-16 lg:bottom-12 lg:left-14">
          <span className="mb-2 inline-flex rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wider text-primary-foreground sm:text-xs">
            {article.category || config.label}
          </span>
          <h2 className="line-clamp-3 font-heading text-lg font-bold leading-tight sm:text-2xl lg:text-4xl">
            {article.title}
          </h2>
          <p className="mt-2 hidden max-w-2xl line-clamp-2 text-sm text-white/80 sm:block lg:text-base">
            {article.description}
          </p>
        </div>
      </>
    );

    return article.url && article.url !== "#" ? (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-full min-w-full snap-center"
        aria-label={`Ler: ${article.title}`}
      >
        {content}
      </a>
    ) : (
      <div className="relative h-full min-w-full snap-center">{content}</div>
    );
  };

  return (
    <section
      aria-label={`Notícias em destaque: ${config.label}`}
      className="group relative overflow-hidden rounded-2xl border border-border/60 shadow-card"
    >
      <div className="relative aspect-[8/3] w-full bg-black sm:aspect-[3/1]">
        <div
          ref={mobileTrackRef}
          onScroll={(event) => {
            const track = event.currentTarget;
            if (!track.clientWidth) return;
            const index = Math.round(track.scrollLeft / track.clientWidth);
            setCurrent((previous) => previous === index ? previous : index);
          }}
          className="absolute inset-0 z-10 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-hide sm:hidden"
        >
          {slides.map((article, index) => (
            <div key={article.id} className="relative h-full min-w-full snap-center">
              {renderSlide(article, index)}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 hidden sm:block">
          {slides.map((article, index) => (
            <div
              key={article.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === current
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-105 opacity-0"
              }`}
            >
              {renderSlide(article, index)}
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          aria-label="Notícia anterior"
          className="group/nav absolute left-2 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center text-foreground transition-all duration-300 sm:flex sm:opacity-0 sm:group-hover:opacity-100 lg:left-4"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-background/70 backdrop-blur-sm transition-colors group-hover/nav:bg-primary group-hover/nav:text-primary-foreground">
            <ChevronLeft className="h-3.5 w-3.5" />
          </span>
        </button>
        <button
          onClick={next}
          aria-label="Próxima notícia"
          className="group/nav absolute right-2 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center text-foreground transition-all duration-300 sm:flex sm:opacity-0 sm:group-hover:opacity-100 lg:right-4"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-background/70 backdrop-blur-sm transition-colors group-hover/nav:bg-primary group-hover/nav:text-primary-foreground">
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>

        <div className="absolute bottom-0 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 sm:flex">
          {slides.map((article, index) => (
            <button
              key={article.id}
              onClick={() => goTo(index)}
              aria-label={`Ir para notícia ${index + 1}`}
              className="group/dot relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300"
            >
              <span
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "scale-100 bg-primary shadow-md shadow-primary/40"
                    : "scale-75 bg-muted-foreground/40 hover:scale-100 hover:bg-muted-foreground"
                }`}
              />
              {index === current && (
                <span className="absolute inset-[15px] animate-spin rounded-full border border-transparent border-t-primary/60 [animation-duration:6s]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-12 items-center justify-between gap-1 border-t border-border bg-background px-2 sm:hidden">
        <div className="flex min-w-0 flex-1 items-center justify-center">
          {slides.map((article, index) => (
            <button
              key={article.id}
              onClick={() => goTo(index)}
              aria-label={`Ir para notícia ${index + 1}`}
              className="flex h-7 w-6 shrink-0 items-center justify-center"
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${index === current ? "bg-primary" : "bg-muted-foreground/40"}`} />
            </button>
          ))}
        </div>
        {slides[current]?.url && slides[current].url !== "#" && (
          <a
            href={slides[current].url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-md bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Saiba Mais
          </a>
        )}
      </div>
    </section>
  );
}
