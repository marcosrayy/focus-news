"use client";

import { Menu, Search, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { navItems } from "@/components/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (pathname !== "/search") return;

    const query = new URLSearchParams(window.location.search).get("q") || "";
    setSearchValue(query);
    if (query) setSearchOpen(true);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/search" || !searchValue) return;

    const input = window.matchMedia("(min-width: 640px)").matches
      ? desktopSearchInputRef.current
      : mobileSearchInputRef.current;
    input?.focus();
  }, [pathname, searchOpen, searchValue]);

  const handleSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    const value = searchValue.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/85 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3 lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="rounded-full p-2 text-foreground transition-colors duration-300 hover:bg-secondary sm:hidden"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="border-b border-border px-6 py-5 text-left">
              <SheetTitle className="font-heading tracking-wider">MENU</SheetTitle>
            </SheetHeader>
            <nav aria-label="Navegação principal" className="flex flex-col p-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center justify-between rounded-lg px-4 py-3.5 text-sm font-semibold tracking-wider transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : item.special
                            ? "text-primary/80 hover:bg-secondary hover:text-primary"
                            : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {item.label}
                      {item.special && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <form onSubmit={handleSearch} className="hidden items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-2 transition-colors duration-300 focus-within:border-primary/50 sm:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={desktopSearchInputRef}
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Pesquisar..."
            className="w-40 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none lg:w-56"
          />
        </form>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <a href="/" className="flex items-center">
          <h1>
            <img
              src="/focus-news-logo-light.png"
              alt="Focus News"
              className="h-auto w-36 dark:hidden sm:w-44 lg:w-52"
            />
            <img
              src="/focus-news-logo.png"
              alt=""
              aria-hidden="true"
              className="hidden h-auto w-36 dark:block sm:w-44 lg:w-52"
            />
          </h1>
        </a>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="rounded-full p-2 text-foreground transition-colors duration-300 hover:bg-secondary sm:hidden"
          aria-label="Buscar"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
        </button>
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
              ref={mobileSearchInputRef}
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Pesquisar..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
          </form>
        </div>
      )}
    </header>
  );
}
