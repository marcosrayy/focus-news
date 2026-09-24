import type { ReactNode } from "react";

interface NewsSectionLayoutProps {
  featured: ReactNode;
  list: ReactNode;
  sidebar?: ReactNode;
}

export function NewsSectionLayout({ featured, list, sidebar }: NewsSectionLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)]">
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">{featured}</div>
      {sidebar && <div className="h-full min-w-0 lg:col-start-2 lg:row-start-1">{sidebar}</div>}
      <div className="min-w-0 lg:col-span-2">{list}</div>
    </div>
  );
}