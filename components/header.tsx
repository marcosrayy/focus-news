"use client";

import { Search, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";
import { TechSidebarContent } from "@/components/tecnologia/tech-sidebar";
import { BusinessSidebarContent } from "@/components/business/business-sidebar";
import { DevSidebarContent } from "@/components/dev/dev-sidebar";
import { IASidebarContent } from "@/components/ia/ia-sidebar";
import { InovacaoSidebarContent } from "@/components/inovacao/inovacao-sidebar";
import { StartupSidebarContent } from "@/components/startups/startup-sidebar";
import { TradeSidebarContent } from "@/components/trade/trade-sidebar";
import { EconomySidebarContent } from "@/components/economia/economy-sidebar";
import { HomeMarketSidebarContent } from "@/components/home-market-sidebar";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    const value = searchValue.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
    setSearchOpen(false);
  };

  const mobileExplore = (() => {
    switch (pathname) {
      case "/":
        return {
          title: "MERCADO AGORA",
          items: ["Big Tech", "Digital Assets", "Índices e ações"],
          content: <HomeMarketSidebarContent />,
        };
      case "/tecnologia":
        return {
          title: "TECNOLOGIA",
          items: ["Categorias", "Comparativos", "Análises profundas"],
          content: <TechSidebarContent />,
        };
      case "/business":
        return {
          title: "BUSINESS",
          items: ["Líderes de mercado", "Agenda do CEO", "Eventos"],
          content: <BusinessSidebarContent />,
        };
      case "/dev":
        return {
          title: "DESENVOLVIMENTO",
          items: ["Código da semana", "Tags populares", "Tutoriais"],
          content: <DevSidebarContent />,
        };
      case "/ia":
        return {
          title: "INTELIGÊNCIA ARTIFICIAL",
          items: ["Ética e regulação", "Tendências globais", "IA na prática"],
          content: <IASidebarContent />,
        };
      case "/inovacao":
        return {
          title: "INOVAÇÃO",
          items: ["Entrevistas", "Modelos inovadores", "Futuro em construção"],
          content: <InovacaoSidebarContent />,
        };
      case "/startups":
        return {
          title: "STARTUPS",
          items: ["Maiores startups", "Investidores ativos", "Setores em alta"],
          content: <StartupSidebarContent />,
        };
      case "/trade":
        return {
          title: "TRADE",
          items: ["Cotações ao vivo", "Maiores movimentações", "Sinais"],
          content: <TradeSidebarContent />,
        };
      case "/economia":
        return {
          title: "ECONOMIA",
          items: ["Maiores altas", "Maiores baixas", "Câmbio"],
          content: <EconomySidebarContent />,
        };
      default:
        return null;
    }
  })();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/85 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3 lg:px-6">
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="hidden items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-2 transition-colors duration-300 focus-within:border-primary/50 sm:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Pesquisar Terminal..."
            className="w-40 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none lg:w-56"
          />
        </form>
        <button
          className="rounded-full p-2 text-foreground transition-colors duration-300 hover:bg-secondary sm:hidden"
          aria-label="Buscar"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <a href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-primary shadow-glow-sm" />
          <h1 className="font-heading text-xl font-extrabold tracking-tight lg:text-2xl">
            <span className="text-primary">FOCUS</span>{" "}
            <span className="text-foreground">NEWS</span>
          </h1>
        </a>
      </div>

      <div className="flex items-center gap-2">
        {mobileExplore && (
          <SidebarCardsModal title={mobileExplore.title} items={mobileExplore.items} triggerVariant="icon">
            {mobileExplore.content}
          </SidebarCardsModal>
        )}

        <button
          className="relative rounded-full p-2 text-foreground transition-colors duration-300 hover:bg-secondary hover:text-primary"
          aria-label="Alternar tema claro/escuro"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute left-2 top-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </button>
      </div>

      {searchOpen && (
        <div className="absolute left-0 top-full w-full border-b border-border/60 bg-background px-4 py-3 sm:hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Pesquisar Terminal..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
          </form>
        </div>
      )}
    </header>
  );
}
