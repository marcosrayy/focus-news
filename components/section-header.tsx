"use client";

import { SyncBar } from "@/components/market-ticker";

export function SectionHeader() {
  return (
    <div className="flex flex-col items-start justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center lg:px-0">
      <div className="flex items-center gap-2.5">
        <div className="h-6 w-1.5 rounded-full bg-primary shadow-glow-sm" />
        <h2 className="font-heading text-lg font-bold tracking-wider text-foreground">
          EXPLORAR TECH
        </h2>
      </div>
      <SyncBar />
    </div>
  );
}
