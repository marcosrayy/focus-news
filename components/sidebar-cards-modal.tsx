"use client";

import { ArrowRight, LayoutGrid } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SidebarCardsModalProps {
  title: string;
  items: string[];
  children: React.ReactNode;
  triggerVariant?: "card" | "icon";
}

export function SidebarCardsModal({ title, items, children, triggerVariant = "card" }: SidebarCardsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerVariant === "icon" ? (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-colors duration-300 hover:border-primary/40 hover:text-primary sm:hidden"
            aria-label={`Abrir explorar ${title}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <LayoutGrid className="h-4 w-4 text-primary" />
                </div>
                <span className="font-heading text-sm font-bold tracking-wider text-foreground">
                  EXPLORAR
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-between">
              {items.map((item, index) => (
                <span
                  key={item}
                  className="group flex flex-1 items-center justify-between border-b border-border px-5 py-4 last:border-b-0 group-hover:bg-secondary/60"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold text-foreground">{item}</span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">Saiba mais</span>
                    </span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-border px-4 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                CARDS
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Abrir todos
              </span>
            </div>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-background p-4 sm:max-w-xl sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="font-heading tracking-wider">{title}</DialogTitle>
          <DialogDescription>
            Informações atualizadas da seção selecionada.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}