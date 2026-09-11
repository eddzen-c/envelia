import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-background/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
        <Link
          aria-label="Envelia Studio, página de inicio"
          className="font-display text-xl font-semibold tracking-tight text-foreground"
          href="/"
        >
          Envelia
          <span className="text-primary"> Studio</span>
        </Link>

        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-champagne-300 bg-champagne-50 px-4 py-2 text-xs font-semibold tracking-[0.12em] text-champagne-800 uppercase transition-colors hover:border-champagne-400 hover:bg-champagne-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:px-5"
          href="/studio"
        >
          Abrir Studio
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </header>
  );
}
