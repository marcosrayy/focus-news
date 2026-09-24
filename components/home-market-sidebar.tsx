"use client";

import { BigTechSidebar } from "@/components/big-tech-sidebar";
import { DigitalAssets } from "@/components/digital-assets";
import { MarketOverview } from "@/components/market-overview";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

export function HomeMarketSidebar() {
  return (
    <SidebarCardsModal
      title="MERCADO AGORA"
      items={["Big Tech", "Digital Assets", "Índices e ações"]}
    >
      <BigTechSidebar />
      <DigitalAssets />
      <MarketOverview />
    </SidebarCardsModal>
  );
}