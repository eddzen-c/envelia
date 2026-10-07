import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { BotanicalDivider } from '../_components/botanical-divider';
import { InspirationCard } from './_components/inspiration-card';

const occasions = [
  {
    description: 'Elegancia para el gran día.',
    href: '/plantillas?categoria=bodas',
    image: '/assets/envelia/inspiration/wedding-closeup.webp',
    imageAlt: 'Invitación floral de boda de Valeria y Santiago',
    title: 'Bodas',
  },
  {
    description: 'Sueños que se vuelven realidad.',
    href: '/plantillas?categoria=xv',
    image: '/assets/envelia/inspiration/quinceanera.webp',
    imageAlt: 'Invitación rosa de XV años de Camila',
    title: 'XV años',
  },
  {
    description: 'Pequeños comienzos, grandes historias.',
    href: '/plantillas?categoria=baby-shower',
    image: '/assets/envelia/inspiration/baby-shower.webp',
    imageAlt: 'Invitación de baby shower de Emilio junto a un oso de peluche',
    title: 'Baby Shower',
  },
  {
    description: 'Cada ocasión merece un diseño único.',
    href: '/plantillas?categoria=especiales',
    image: '/assets/envelia/inspiration/birthday.webp',
    imageAlt: 'Invitación borgoña para el cumpleaños de Andrea',
    title: 'Eventos especiales',
  },
] as const;

const ideas = [
  {
    description: 'Tonos que cuentan historias.',
    href: '/plantillas',
    image: '/assets/envelia/inspiration/burgundy-palette.webp',
    imageAlt: 'Paleta de colores borgoña junto a flores y papelería',
    title: 'Paletas de color',
  },
  {
    description: 'Detalles que hacen la diferencia.',
    href: '/plantillas',
    image: '/assets/envelia/inspiration/monogram.webp',
    imageAlt: 'Monograma caligráfico dorado sobre papel artesanal',
    title: 'Tipografías elegantes',
  },
  {
    description: 'Ideas para un evento inolvidable.',
    href: '/plantillas',
    image: '/assets/envelia/inspiration/table-menu.webp',
    imageAlt: 'Menú floral sobre una mesa elegante',
    title: 'Decoración y ambientación',
  },
  {
    description: 'Pequeños grandes momentos.',
    href: '/plantillas',
    image: '/assets/envelia/inspiration/floral-keepsake.webp',
    imageAlt: 'Recuerdo floral con un lazo rosa',
    title: 'Detalles y complementos',
  },
  {
    description: 'Historias que inspiran.',
    href: '/plantillas',
    image: '/assets/envelia/inspiration/event-decor.webp',
    imageAlt: 'Decoración floral de una celebración elegante',
    title: 'Eventos reales',
  },
] as const;

export const metadata: Metadata = {
  title: 'Inspiración | Envelia Studio',
  description:
    'Descubre ideas, colores, estilos y detalles para crear invitaciones digitales memorables.',
};

export default function InspirationPage() {
  return (
    <main className="relative isolate overflow-hidden bg-surface" id="main-content">
      <div className="relative isolate m-0 overflow-hidden border-0">
        <Image
          alt=""
          aria-hidden="true"
          className="-z-10 object-cover object-top"
          data-testid="inspiration-hero-background"
          fill
          priority
          sizes="100vw"
          src="/assets/envelia/inspiration/hero-reference.webp"
        />
        <section
          aria-labelledby="inspiration-title"
          className="relative flex min-h-[26rem] items-center px-5 pt-24 pb-8 sm:px-8 lg:min-h-[30vw] lg:px-12"
        >
          <div className="mx-auto w-full max-w-[90rem]">
            <div className="relative z-10 max-w-[41rem] py-4 lg:w-[47%]">
              <div className="flex items-center gap-3 text-champagne-700">
                <p className="text-[0.68rem] font-semibold tracking-[0.4em] uppercase">
                  Inspiración
                </p>
                <span aria-hidden="true" className="h-px w-16 bg-current/55" />
                <Image
                  alt=""
                  aria-hidden="true"
                  className="size-8 object-contain"
                  height={224}
                  src="/assets/envelia/icons/botanical-leaf.webp"
                  width={224}
                />
                <span aria-hidden="true" className="h-px w-24 bg-current/55" />
              </div>

              <h1
                className="mt-3 font-display text-[clamp(3rem,5.2vw,4rem)] leading-[0.88] font-semibold tracking-[-0.05em] text-primary"
                id="inspiration-title"
              >
                Ideas que hacen <span className="block">momentos inolvidables</span>
              </h1>
              <p className="mt-4 max-w-[39rem] font-display text-xl leading-7 text-foreground/80 sm:text-2xl sm:leading-8">
                Déjate inspirar por diseños, colores, estilos y detalles que convierten cada
                celebración en una historia única.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-brand-900 focus-visible:outline-primary motion-reduce:transition-none"
                  href="#ocasiones"
                >
                  <span aria-hidden="true" className="text-champagne-300">
                    ✦
                  </span>
                  Explorar ideas
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-champagne-600 bg-surface/75 px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-champagne-50 focus-visible:outline-primary motion-reduce:transition-none"
                  href="/plantillas"
                >
                  Ver plantillas
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <blockquote className="sr-only">
              Cada celebración tiene una historia. Aquí comienza la tuya.
            </blockquote>
          </div>
        </section>

        <section
          aria-labelledby="occasions-title"
          className="relative px-5 py-7 sm:px-8 lg:px-12"
          id="ocasiones"
        >
          <div className="mx-auto w-full max-w-[90rem]">
            <BotanicalDivider className="text-champagne-600" />
            <p className="mt-1 text-center text-[0.62rem] font-semibold tracking-[0.4em] text-champagne-700 uppercase">
              Inspiración por ocasión
            </p>
            <h2
              className="mt-1 text-center font-display text-4xl leading-tight font-semibold text-primary"
              id="occasions-title"
            >
              Celebra cada etapa de la vida
            </h2>
            <p className="mt-1 text-center font-display text-lg text-foreground/72">
              Encuentra ideas, estilos y detalles que se adaptan a cada momento especial.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {occasions.map((occasion) => (
                <InspirationCard {...occasion} key={occasion.title} variant="occasion" />
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="relative isolate m-0 overflow-hidden border-0 bg-[#fffaf3]">
        <Image
          alt=""
          aria-hidden="true"
          className="-z-10 object-cover object-bottom"
          data-testid="inspiration-section-background"
          fill
          sizes="100vw"
          src="/assets/envelia/inspiration/lower-reference.webp"
        />
        <section aria-labelledby="ideas-title" className="relative px-5 pt-6 pb-5 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-[90rem]">
            <BotanicalDivider className="text-champagne-600" />
            <p className="mt-1 text-center text-[0.62rem] font-semibold tracking-[0.4em] text-champagne-700 uppercase">
              Ideas que inspiran
            </p>

            <div className="mt-2 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:ml-[2vw] xl:grid-cols-[1.15fr_repeat(5,minmax(0,1fr))]">
              <div className="flex flex-col justify-center px-1 pt-1 pb-8 sm:col-span-2 lg:col-span-1 xl:col-span-1 xl:pr-3">
                <h2
                  className="font-display text-4xl leading-[0.98] font-semibold text-primary"
                  id="ideas-title"
                >
                  Tendencias, estilos y detalles{' '}
                  <em className="font-normal text-champagne-700">que enamoran.</em>
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-5 text-foreground/70">
                  Explora moodboards, paletas de color, combinaciones de tipografías, ambientaciones
                  y más ideas para crear invitaciones que reflejen tu esencia.
                </p>
                <Link
                  className="mt-4 inline-flex min-h-11 w-fit items-center justify-center gap-3 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-900 focus-visible:outline-primary motion-reduce:transition-none"
                  href="/plantillas"
                >
                  <span aria-hidden="true" className="text-champagne-300">
                    ✦
                  </span>
                  Ver más inspiración
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {ideas.map((idea) => (
                <InspirationCard {...idea} key={idea.title} variant="idea" />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-champagne-600">
              <span aria-hidden="true" className="h-px w-16 bg-current/55 sm:w-28" />
              <span aria-hidden="true" className="text-xl">
                ✦
              </span>
              <p className="text-center font-display text-xl font-semibold text-primary italic sm:text-2xl">
                La inspiración de hoy puede ser el inicio de tu mejor historia.
              </p>
              <span aria-hidden="true" className="text-xl">
                ✦
              </span>
              <span aria-hidden="true" className="h-px w-16 bg-current/55 sm:w-28" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
