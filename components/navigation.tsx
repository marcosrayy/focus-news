"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "FOCUS", href: "/focus", special: true },
  { label: "TECNOLOGIA", href: "/tecnologia" },
  { label: "DEV", href: "/dev" },
  { label: "STARTUPS", href: "/startups" },
  { label: "ECONOMIA", href: "/economia" },
  { label: "IA", href: "/ia" },
  { label: "BUSINESS", href: "/business" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="border-b border-border bg-background"
      role="navigation"
      aria-label="Navegacao principal"
    >
      <div className="scrollbar-hide flex items-center gap-0.5 overflow-x-auto px-2 snap-x snap-mandatory whitespace-nowrap sm:gap-1 lg:justify-center lg:gap-2 lg:px-6">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href === "/" && pathname === "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex shrink-0 snap-start items-center gap-1 px-2.5 py-3.5 text-[11px] font-semibold tracking-wider transition-colors duration-300 sm:px-3 sm:py-3 sm:text-xs lg:px-4 lg:text-sm ${
                isActive
                  ? "text-primary"
                  : item.special
                    ? "text-primary/80 hover:text-primary"
                    : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span
                className={`rounded-full px-2.5 py-1 transition-colors duration-300 ${isActive ? "bg-primary/10" : "group-hover:bg-secondary/70"}`}
              >
                {item.label}
              </span>
              {item.special && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              )}
              <span
                className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 bg-primary transition-all duration-300 ${
                  isActive ? "w-6" : "w-0 group-hover:w-6"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
