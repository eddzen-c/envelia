import Image from 'next/image';
import Link from 'next/link';

import { contactDetails } from '../contacto/_components/contact-details';

import { BotanicalDivider } from './botanical-divider';

const primaryLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/plantillas', label: 'Plantillas' },
  { href: '/como-funciona', label: 'Cómo funciona' },
  { href: '/precios', label: 'Precios' },
  { href: '/inspiracion', label: 'Inspiración' },
] as const;

const supportLinks = [
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
] as const;

const FooterCornerBotanical = ({ mirrored = false }: Readonly<{ mirrored?: boolean }>) => (
  <svg
    aria-hidden="true"
    className={`absolute bottom-0 h-24 w-40 text-champagne-500/60 sm:h-28 sm:w-52 ${
      mirrored ? 'right-0 -scale-x-100' : 'left-0'
    }`}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.05"
    viewBox="0 0 200 110"
  >
    <path d="M2 108c24-31 57-56 105-76 24-10 52-17 89-20" />
    <path d="M28 82C14 72 11 59 17 45c14 7 20 19 11 37Zm27-21C40 48 39 34 48 20c14 10 16 24 7 41Zm29-17C72 29 74 16 85 4c11 12 11 26-1 40Zm34-13c-5-15 1-26 15-34 7 14 2 25-15 34Zm-72 39c13 0 23 7 29 20-15 4-26-3-29-20Zm33-18c15-2 26 3 34 16-14 7-26 1-34-16Zm38-15c14-5 26-2 36 9-12 9-24 6-36-9Zm39-12c12-7 24-7 36 2-10 11-22 10-36-2Z" />
  </svg>
);

const SocialMarks = () => (
  <nav aria-label="Redes sociales" className="flex items-center gap-2.5 text-champagne-200">
    <a
      aria-label="Instagram"
      href={contactDetails.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="grid size-8 place-items-center rounded-full border border-current/75"
    >
      <svg
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <rect height="17" rx="5" width="17" x="3.5" y="3.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.7" fill="currentColor" r="0.8" stroke="none" />
      </svg>
    </a>
    <a
      aria-label="Pinterest"
      href={contactDetails.pinterest}
      target="_blank"
      rel="noopener noreferrer"
      className="grid size-8 place-items-center rounded-full border border-current/75"
    >
      <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.7a9.3 9.3 0 0 0-3.4 18c-.1-1.5 0-3.2.4-4.6l1.2-5s-.3-.7-.3-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.6.8 1.6 1.8 0 1.1-.7 2.6-1 4-.6 1.2.6 2.2 1.8 2.2 2.2 0 3.8-2.3 3.8-5.6 0-2.9-2.1-5-5.1-5-3.5 0-5.5 2.6-5.5 5.3 0 1 .4 2.1.9 2.7.1.1.1.2.1.4l-.3 1.2c-.1.4-.4.5-.8.3-1.7-.8-2.7-3.1-2.7-5 0-4.1 3-7.8 8.5-7.8 4.5 0 8 3.2 8 7.4 0 4.4-2.8 8-6.7 8-1.3 0-2.5-.7-2.9-1.5l-.8 3c-.3 1.1-1.1 2.5-1.6 3.3.9.3 1.9.4 2.9.4A9.3 9.3 0 1 0 12 2.7Z" />
      </svg>
    </a>
    <a
      aria-label="Facebook"
      href={contactDetails.facebook}
      target="_blank"
      rel="noopener noreferrer"
      className="grid size-8 place-items-center rounded-full border border-current/75 font-display text-lg leading-none"
    >
      <span aria-hidden="true">f</span>
    </a>
  </nav>
);

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-champagne-500/35 bg-[linear-gradient(115deg,#2b0718_0%,#491127_50%,#240512_100%)] text-primary-foreground">
      <FooterCornerBotanical />
      <FooterCornerBotanical mirrored />

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-5 py-4 sm:px-8 lg:px-12">
        <div className="grid items-center gap-5 lg:grid-cols-[10rem_minmax(0,1fr)_auto] lg:gap-7">
          <Link
            aria-label="Envelia Studio, página de inicio"
            className="mx-auto inline-block rounded-md focus-visible:outline-champagne-300 lg:mx-0"
            href="/"
          >
            <Image
              alt="Envelia Studio"
              className="h-auto w-36"
              height={533}
              src="/assets/envelia/brand/logo-horizontal-dark.webp"
              width={1600}
            />
          </Link>

          <div className="min-w-0">
            <div className="flex flex-col items-center justify-center gap-3 xl:flex-row xl:gap-6">
              <nav aria-label="Navegación pública del pie de página">
                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-primary-foreground/75">
                  {primaryLinks.map((item) => (
                    <li key={item.href}>
                      <Link className="transition-colors hover:text-champagne-200" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <span aria-hidden="true" className="hidden h-6 w-px bg-champagne-400/45 xl:block" />

              <nav aria-label="Ayuda y contacto">
                <ul className="flex items-center justify-center gap-6 text-xs text-primary-foreground/75">
                  {supportLinks.map((item) => (
                    <li key={item.href}>
                      <Link className="transition-colors hover:text-champagne-200" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <BotanicalDivider className="mt-2 text-champagne-400" />
          </div>

          <div className="flex justify-center lg:justify-end">
            <SocialMarks />
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center justify-between gap-2 border-t border-primary-foreground/10 pt-3 text-center text-[0.68rem] text-primary-foreground/50 sm:flex-row sm:text-left">
          <p>© 2026 Envelia Studio. Todos los derechos reservados.</p>
          <p className="font-display text-xs tracking-wide text-primary-foreground/60">
            Diseño que convierte momentos en recuerdos eternos.
          </p>
        </div>
      </div>
    </footer>
  );
}
