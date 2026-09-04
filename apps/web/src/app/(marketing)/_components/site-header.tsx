import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-background/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link
          aria-label="Envelia Studio, página de inicio"
          className="font-display text-xl font-semibold tracking-tight text-foreground"
          href="/"
        >
          Envelia
          <span className="text-primary"> Studio</span>
        </Link>

        <span className="rounded-full border border-champagne-300 bg-champagne-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-champagne-800 uppercase">
          Próximamente
        </span>
      </div>
    </header>
  );
}
