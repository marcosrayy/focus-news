"use client";

import { Search, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/85 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-2 transition-colors duration-300 focus-within:border-primary/50 sm:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar Terminal..."
            className="w-40 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none lg:w-56"
          />
        </div>
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

      <button
        className="relative rounded-full p-2 text-foreground transition-colors duration-300 hover:bg-secondary hover:text-primary"
        aria-label="Alternar tema claro/escuro"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute left-2 top-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Alternar tema</span>
      </button>

      {searchOpen && (
        <div className="absolute left-0 top-full w-full border-b border-border/60 bg-background px-4 py-3 sm:hidden">
          <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar Terminal..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
