import Image from 'next/image';
import Link from 'next/link';

import { BotanicalDivider } from './_components/botanical-divider';
import { HomeBenefitList } from './_components/home-benefit-list';
import { HomeDiscoveryCard } from './_components/home-discovery-card';

const discoveryItems = [
  {
    title: 'Plantillas',
    description: 'Descubre diseños únicos para cada ocasión.',
    href: '/plantillas',
    image: '/assets/envelia/home/wedding-invitation-detail.webp',
  },
  {
    title: 'Cómo funciona',
    description: 'Crea tu invitación en simples pasos.',
    href: '/como-funciona',
    image: '/assets/envelia/home/editor-laptop.webp',
  },
  {
    title: 'Precios',
    description: 'Planes flexibles para cada historia.',
    href: '/precios',
    image: '/assets/envelia/home/plans-showcase.webp',
  },
  {
    title: 'Inspiración',
    description: 'Ideas reales para momentos inolvidables.',
    href: '/inspiracion',
    image: '/assets/envelia/home/stationery-inspiration.webp',
  },
] as const;

export default function HomePage() {
  return (
    <main id="main-content">
      <section
        aria-labelledby="hero-title"
        className="relative isolate overflow-hidden border-b border-champagne-200"
      >
        <div className="grid min-h-[44rem] lg:grid-cols-[minmax(0,0.92fr)_minmax(32rem,1.08fr)]">
          <div className="relative flex items-center bg-background px-5 pt-36 pb-16 sm:px-8 lg:px-12 lg:pt-32 xl:pl-[max(3rem,calc((100vw-90rem)/2+3rem))]">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgb(255_255_255_/_75%),transparent_42%),linear-gradient(115deg,transparent_60%,rgb(239_223_189_/_22%))]"
            />
            <div className="w-full max-w-3xl">
              <BotanicalDivider className="justify-start text-champagne-600" />

              <p className="mt-5 text-xs font-semibold tracking-[0.32em] text-foreground/65 uppercase">
                Invitaciones digitales premium
              </p>
              <h1
                className="mt-4 max-w-3xl font-display text-5xl leading-[0.94] font-semibold tracking-[-0.045em] text-primary sm:text-6xl xl:text-[5.7rem]"
                id="hero-title"
              >
                Bienvenida a <span className="block">Envelia Studio</span>
              </h1>
              <p className="mt-6 max-w-2xl font-display text-2xl leading-8 text-foreground sm:text-3xl">
                <em className="font-semibold text-primary">
                  Diseña invitaciones digitales elegantes
                </em>
                <span className="block text-xl not-italic sm:text-2xl">
                  para los momentos más especiales de tu vida.
                </span>
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-brand-900 focus-visible:outline-primary motion-reduce:transition-none"
                  href="/crear-cuenta"
                >
                  <span aria-hidden="true" className="text-champagne-300">
                    ✦
                  </span>
                  Crear invitación
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-champagne-500 bg-surface/80 px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-champagne-50 focus-visible:outline-primary motion-reduce:transition-none"
                  href="/plantillas"
                >
                  Explorar plantillas
                </Link>
              </div>

              <HomeBenefitList />
            </div>
          </div>

          <figure
            aria-label="Invitación floral premium de Envelia Studio"
            className="relative min-h-[28rem] overflow-hidden lg:min-h-full"
          >
            <Image
              alt="Invitación de boda floral junto a un sobre borgoña y flores blancas"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              src="/assets/envelia/home/wedding-invitation.webp"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-background to-transparent"
            />
          </figure>
        </div>
      </section>

      <section
        aria-labelledby="discover-title"
        className="relative bg-surface-muted px-5 py-6 sm:px-8 lg:px-12"
      >
        <h2 className="sr-only" id="discover-title">
          Descubre Envelia Studio
        </h2>
        <div className="mx-auto grid w-full max-w-[90rem] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {discoveryItems.map((item) => (
            <HomeDiscoveryCard {...item} key={item.href} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="manifesto-title"
        className="relative isolate overflow-hidden px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-24"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="-z-10 object-cover opacity-90"
          fill
          sizes="100vw"
          src="/assets/envelia/home/floral-background.webp"
        />
        <div className="mx-auto max-w-4xl">
          <BotanicalDivider className="text-champagne-600" />
          <p className="mt-3 text-xs font-semibold tracking-[0.35em] text-champagne-700 uppercase">
            Más que invitaciones
          </p>
          <h2
            className="mt-5 font-display text-4xl leading-tight font-semibold text-primary sm:text-5xl"
            id="manifesto-title"
          >
            Diseño que convierte momentos en <em>recuerdos eternos.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-foreground/75 sm:text-lg">
            En Envelia Studio creemos en la belleza de los nuevos comienzos, en esos instantes que
            merecen ser compartidos de una manera especial.
          </p>
        </div>
      </section>
    </main>
  );
}
