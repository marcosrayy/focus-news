"use client";

import { Code2, BookOpen, Tag, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import useSWR from "swr";
import { SidebarCardsModal, useCloseExploreModal } from "@/components/sidebar-cards-modal";
import { DEV_TOPIC_QUERIES } from "@/config/dev-news";

interface TutorialVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
}

interface TutorialVideosResponse {
  videos: TutorialVideo[];
}

const TUTORIAL_REFRESH_INTERVAL = 7 * 24 * 60 * 60 * 1000;

async function fetchTutorialVideos(url: string): Promise<TutorialVideosResponse> {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Não foi possível carregar os tutoriais.");
  }
  return data;
}

const tags = [
  { key: "frontend", name: "Frontend" },
  { key: "backend", name: "Backend" },
  { key: "mobile", name: "Mobile" },
  { key: "devops", name: "DevOps" },
  { key: "ai-dev", name: "IA/ML" },
  { key: "web3", name: "Web3" },
];

const CODE_OF_THE_WEEK_INTERVAL = 7 * 24 * 60 * 60 * 1000;

const weeklyCodeExamples = [
  {
    title: "Filtrando valores com tipos seguros",
    language: "TypeScript",
    snippet: `const scores: number[] = [72, 95, 88];\nconst approved = scores.filter(score => score >= 80);\n\nconsole.log(approved); // [95, 88]`,
  },
  {
    title: "Ordenando uma lista de forma simples",
    language: "Java",
    snippet: `var numbers = List.of(8, 3, 5, 1);\nvar sorted = numbers.stream()\n    .sorted()\n    .toList();\n\nSystem.out.println(sorted);`,
  },
  {
    title: "Removendo valores duplicados",
    language: "JavaScript",
    snippet: `const languages = ["JS", "Python", "JS"];\nconst uniqueLanguages = [...new Set(languages)];\n\nconsole.log(uniqueLanguages);`,
  },
  {
    title: "Contando itens com compreensão de lista",
    language: "Python",
    snippet: `numbers = [2, 5, 8, 11, 14]\neven_numbers = [n for n in numbers if n % 2 == 0]\n\nprint(even_numbers)`,
  },
  {
    title: "Criando uma função reutilizável",
    language: "TypeScript",
    snippet: `function greet(name: string): string {\n  return \`Olá, \${name}!\`;\n}\n\nconsole.log(greet("Dev"));`,
  },
];

function getWeeklyCodeExample(timestamp: number) {
  const weekNumber = Math.floor(timestamp / CODE_OF_THE_WEEK_INTERVAL);
  return weeklyCodeExamples[weekNumber % weeklyCodeExamples.length];
}

export function DevSidebarContent() {
  const router = useRouter();
  const closeExplore = useCloseExploreModal();
  const [codeOfWeek, setCodeOfWeek] = useState(weeklyCodeExamples[0]);

  useEffect(() => {
    let timeoutId: number;

    const updateAtNextWeek = () => {
      const now = Date.now();
      setCodeOfWeek(getWeeklyCodeExample(now));

      const nextWeek = (Math.floor(now / CODE_OF_THE_WEEK_INTERVAL) + 1) * CODE_OF_THE_WEEK_INTERVAL;
      timeoutId = window.setTimeout(updateAtNextWeek, nextWeek - now);
    };

    updateAtNextWeek();
    return () => window.clearTimeout(timeoutId);
  }, []);

  const {
    data: tutorialData,
    error: tutorialError,
    isLoading: tutorialsLoading,
  } = useSWR<TutorialVideosResponse>("/api/dev-tutorials", fetchTutorialVideos, {
    revalidateOnFocus: false,
    refreshInterval: TUTORIAL_REFRESH_INTERVAL,
    dedupingInterval: TUTORIAL_REFRESH_INTERVAL,
  });

  const searchTag = (tag: (typeof tags)[number]) => {
    if (!DEV_TOPIC_QUERIES[tag.key]) {
      throw new Error(`Missing development search query for tag "${tag.key}".`);
    }

    const params = new URLSearchParams({
      q: tag.name,
      devTopic: tag.key,
    });
    router.push(`/search?${params.toString()}`);
    closeExplore();
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">CODIGO DA SEMANA</h3>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-background p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400">{codeOfWeek.language}</span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-muted-foreground">
            <code>{codeOfWeek.snippet}</code>
          </pre>
          <p className="mt-2 text-xs font-semibold text-foreground">{codeOfWeek.title}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Tag className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">TAGS POPULARES</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            return (
              <button
                key={tag.name}
                type="button"
                onClick={() => searchTag(tag)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:border-emerald-400/30 hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Code2 className="h-3 w-3" />
                {tag.name}
                <span className="text-[10px] text-muted-foreground">· Ver notícias</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <BookOpen className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">TUTORIAIS</h3>
        </div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          3 tutoriais de desenvolvimento do Brasil · Atualiza a cada 7 dias
        </p>
        <div className="flex flex-col gap-2">
          {tutorialData?.videos.map((video) => (
            <a
              key={video.videoId}
              href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-emerald-400/30"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                TUTORIAL DEV
              </p>
              <p className="mt-1 text-xs font-bold text-foreground transition-colors group-hover:text-emerald-400">
                {video.title}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {video.channelTitle}
                {video.publishedAt && ` · ${video.publishedAt}`}
                {video.viewCount && ` · ${video.viewCount}`}
              </p>
              <p className="mt-1 text-[10px] font-semibold text-emerald-400">
                Assistir no YouTube →
              </p>
            </a>
          ))}
          {tutorialsLoading && (
            <p className="px-2 py-3 text-xs text-muted-foreground">Carregando vídeos...</p>
          )}
          {tutorialError && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-3">
              <p className="text-xs text-amber-400">{tutorialError.message}</p>
            </div>
          )}
          {!tutorialsLoading && !tutorialError && tutorialData?.videos.length === 0 && (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              Nenhum vídeo de tutorial foi encontrado no momento.
            </p>
          )}
        </div>
      </div>

    </>
  );
}

export function DevSidebar() {
  return (
    <Suspense fallback={null}>
      <DevSidebarInner />
    </Suspense>
  );
}

function DevSidebarInner() {
  return (
    <SidebarCardsModal title="DESENVOLVIMENTO" items={["Código da semana", "Tags populares", "Tutoriais"]}>
      <DevSidebarContent />
    </SidebarCardsModal>
  );
}
