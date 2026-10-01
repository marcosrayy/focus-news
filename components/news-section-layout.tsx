import { Children, isValidElement, type ReactNode } from "react";

interface NewsSectionLayoutProps {
  featured: ReactNode;
  list: ReactNode;
  sidebar?: ReactNode;
}

export function NewsSectionLayout({ featured, list, sidebar }: NewsSectionLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-12 lg:gap-y-4 lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)]">
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">{featured}</div>
      {sidebar && <div className="hidden h-full min-w-0 lg:col-start-2 lg:row-start-1 lg:block">{sidebar}</div>}
      {list && (
        <div className="min-w-0 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2.5 font-heading text-sm font-bold tracking-wider text-foreground">
            <span className="h-5 w-1 rounded-full bg-primary shadow-glow-sm" />
            MAIS NOTÍCIAS
          </h2>
          {list}
        </div>
      )}
    </div>
  );
}

interface FeaturedNewsCarouselProps {
  children: ReactNode;
  label?: string;
  gridClassName?: string;
  slideClassName?: (index: number) => string;
}

export function FeaturedNewsCarousel({
  children,
  label = "Notícias em destaque",
  gridClassName = "sm:grid-cols-3",
  slideClassName,
}: FeaturedNewsCarouselProps) {
  const slideCount = Children.count(children);

  return (
    <div
      aria-label={label}
      className={`flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scrollbar-hide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:grid ${gridClassName} sm:overflow-visible`}
      role="region"
      tabIndex={0}
    >
      {Children.map(children, (child, index) => (
        <div
          key={isValidElement(child) && child.key !== null ? child.key : index}
          aria-label={`Notícia ${index + 1} de ${slideCount}`}
          className={`min-w-full snap-center sm:min-w-0 sm:flex ${slideClassName?.(index) ?? ""}`}
          role="group"
        >
          {child}
        </div>
      ))}
    </div>
  );
}