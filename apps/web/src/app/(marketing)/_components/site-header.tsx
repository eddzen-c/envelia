import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-background/90">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-12">
        <Link
          aria-label="Envelia Studio, página de inicio"
          className="shrink-0 rounded-full font-display text-xl font-semibold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          href="/"
        >
          Envelia
          <span className="hidden text-primary sm:inline"> Studio</span>
        </Link>

        <nav aria-label="Acceso a tu cuenta" className="flex shrink-0 items-center gap-2">
          <Link
            aria-label="Iniciar sesión"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:px-5 sm:text-sm"
            href="/iniciar-sesion"
          >
            <span aria-hidden="true" className="sm:hidden">
              Entrar
            </span>

            <span aria-hidden="true" className="hidden sm:inline">
              Iniciar sesión
            </span>
          </Link>

          <Link
            aria-label="Crear cuenta"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:px-5 sm:text-sm"
            href="/crear-cuenta"
          >
            <span aria-hidden="true" className="sm:hidden">
              Crear
            </span>

            <span aria-hidden="true" className="hidden sm:inline">
              Crear cuenta
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
