'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/', label: 'Inicio' },
  { href: '/plantillas', label: 'Plantillas' },
  { href: '/como-funciona', label: 'Cómo funciona' },
  { href: '/precios', label: 'Precios' },
  { href: '/inspiracion', label: 'Inspiración' },
] as const;

const NavigationLinks = ({ pathname }: Readonly<{ pathname: string }>) =>
  navigationItems.map((item) => (
    <Link
      aria-current={pathname === item.href ? 'page' : undefined}
      className={`rounded-md border-b px-1 py-2 text-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-primary motion-reduce:transition-none ${
        pathname === item.href
          ? 'border-primary font-semibold text-primary'
          : 'border-transparent font-medium text-foreground/75'
      }`}
      href={item.href}
      key={item.href}
    >
      {item.label}
    </Link>
  ));

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-champagne-300/25 bg-[rgb(251_247_239_/_72%)] shadow-[0_0.75rem_2rem_rgb(59_20_36_/_5%)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex min-h-20 w-full max-w-[90rem] items-center justify-between gap-5 px-5 py-2 sm:px-8 lg:px-12">
        <Link
          aria-label="Envelia Studio, página de inicio"
          className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          href="/"
        >
          <Image
            alt="Envelia Studio"
            className="h-auto w-[9.5rem] sm:w-[11rem]"
            height={533}
            priority
            src="/assets/envelia/brand/logo-horizontal-light.webp"
            width={1600}
          />
        </Link>

        <div className="flex items-center gap-6">
          <nav aria-label="Navegación principal" className="hidden items-center gap-5 xl:flex">
            <NavigationLinks pathname={pathname} />
          </nav>

          <nav
            aria-label="Acceso a tu cuenta"
            className="hidden shrink-0 items-center gap-3 border-l border-champagne-400/45 pl-6 xl:flex"
          >
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-brand-50 focus-visible:outline-primary motion-reduce:transition-none"
              href="/iniciar-sesion"
            >
              Iniciar sesión
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-brand-900 focus-visible:outline-primary motion-reduce:transition-none"
              href="/crear-cuenta"
            >
              <span aria-hidden="true" className="text-champagne-300">
                ✦
              </span>
              Crear invitación
            </Link>
          </nav>

          <details className="group relative xl:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-full border border-primary/25 bg-surface px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
              Menú
              <span aria-hidden="true" className="grid gap-1">
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
              </span>
            </summary>

            <div className="absolute top-[calc(100%+0.9rem)] right-0 w-[min(22rem,calc(100vw-2.5rem))] rounded-[1.5rem] border border-champagne-300/60 bg-surface p-4 shadow-elevated">
              <nav
                aria-label="Navegación principal móvil"
                className="flex flex-col gap-1 border-b border-border pb-4"
              >
                <NavigationLinks pathname={pathname} />
              </nav>
              <nav aria-label="Acceso a tu cuenta móvil" className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary/25 px-3 py-2 text-center text-sm font-semibold text-primary"
                  href="/iniciar-sesion"
                >
                  Iniciar sesión
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
                  href="/crear-cuenta"
                >
                  Crear invitación
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
