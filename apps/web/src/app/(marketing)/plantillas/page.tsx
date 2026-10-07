import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { BotanicalDivider } from '../_components/botanical-divider';
import { FeaturedTemplate } from './_components/featured-template';
import { TemplateCard } from './_components/template-card';
import { TemplateSearchForm } from './_components/template-search-form';
import { filterTemplates, normalizeCategory } from './_components/template-filter';
import { TemplateCategoryFilter } from './_components/template-category-filter';

export const metadata: Metadata = {
  title: 'Plantillas digitales | Envelia Studio',
  description:
    'Explora plantillas digitales premium para bodas, XV años, bautizos y celebraciones.',
};

const templates = [
  {
    category: 'Boda',
    categoryId: 'bodas',
    image: '/assets/envelia/templates/wedding-closeup.webp',
    name: 'Jardín Dorado',
  },
  {
    category: 'XV años',
    categoryId: 'xv',
    image: '/assets/envelia/templates/quinceanera.webp',
    name: 'Rosa Eterna',
  },
  {
    category: 'Bautizo',
    categoryId: 'bautizos',
    image: '/assets/envelia/templates/baptism.webp',
    name: 'Paz Natural',
  },
  {
    category: 'Cumpleaños',
    categoryId: 'cumpleanos',
    image: '/assets/envelia/templates/birthday.webp',
    name: 'Brindis Dorado',
  },
  {
    category: 'Eventos empresariales',
    categoryId: 'empresariales',
    image: '/assets/envelia/templates/corporate-event.webp',
    name: 'Minimal Elegante',
  },
] as const;

type TemplatesPageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function TemplatesPage({ searchParams }: TemplatesPageProps = {}) {
  const params = await searchParams;
  const single = (value: string | string[] | undefined) => (typeof value === 'string' ? value : '');
  const category = normalizeCategory(single(params?.categoria));
  const search = single(params?.busqueda).slice(0, 200);
  const order = single(params?.orden);
  const visibleTemplates = filterTemplates(templates, category, search, order);
  return (
    <main id="main-content">
      <section aria-labelledby="templates-hero-title" className="relative isolate overflow-hidden">
        <div className="grid min-h-[34rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(32rem,1.05fr)]">
          <div className="relative flex items-center bg-background px-5 pt-36 pb-14 sm:px-8 lg:px-12 lg:pt-32 xl:pl-[max(3rem,calc((100vw-90rem)/2+3rem))]">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_30%,white_0%,transparent_55%)]"
            />
            <div className="max-w-3xl">
              <BotanicalDivider className="justify-start text-champagne-600" />
              <p className="mt-3 text-xs font-semibold tracking-[0.32em] text-foreground/65 uppercase">
                Plantillas digitales premium
              </p>
              <h1
                className="mt-3 font-display text-5xl leading-[0.95] font-semibold tracking-[-0.04em] text-primary sm:text-6xl xl:text-[5.2rem]"
                id="templates-hero-title"
              >
                Diseños que cuentan <span className="block">tu historia</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/75">
                Explora nuestra colección de plantillas digitales, creadas para cada ocasión
                especial. Personaliza, comparte y convierte cada momento en un recuerdo inolvidable.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-4 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-brand-900"
                  href="/crear-cuenta"
                >
                  <span aria-hidden="true" className="text-champagne-300">
                    ✦
                  </span>
                  Crear invitación <span aria-hidden="true">→</span>
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-champagne-500 bg-surface/75 px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-champagne-50"
                  href="/como-funciona"
                >
                  Cómo funciona
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[27rem] overflow-hidden lg:min-h-full">
            <Image
              alt="Colección Jardín Dorado con invitación floral y sobre borgoña"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              src="/assets/envelia/templates/wedding-overview.webp"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent"
            />
          </div>
        </div>
      </section>

      <div className="relative isolate overflow-hidden bg-surface-muted/65 px-5 py-5 sm:px-8 lg:px-12">
        <Image
          alt=""
          aria-hidden="true"
          className="-z-10 object-cover opacity-20"
          fill
          sizes="100vw"
          src="/assets/envelia/templates/background.webp"
        />
        <TemplateCategoryFilter activeCategory={category} />
      </div>

      <section
        aria-label="Plantilla destacada"
        className="bg-background px-5 py-5 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-[90rem]">
          <FeaturedTemplate />
        </div>
      </section>

      <section
        aria-labelledby="all-templates-title"
        className="relative isolate overflow-hidden bg-background px-5 pt-3 pb-8 sm:px-8 lg:px-12"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="-z-10 object-cover opacity-15"
          fill
          sizes="100vw"
          src="/assets/envelia/templates/background.webp"
        />
        <div className="mx-auto max-w-[90rem]">
          <div className="flex flex-col gap-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <h2
              className="flex items-center gap-3 font-display text-3xl font-semibold text-primary"
              id="all-templates-title"
            >
              <Image
                alt=""
                aria-hidden="true"
                className="size-8 object-contain"
                height={224}
                src="/assets/envelia/icons/botanical-leaf.webp"
                width={224}
              />
              Todas las plantillas
            </h2>
            <TemplateSearchForm
              aria-label="Buscar y ordenar plantillas"
              className="flex flex-col gap-3 sm:flex-row"
              role="search"
            >
              <input type="hidden" name="categoria" value={category} />
              <label className="relative">
                <span className="sr-only">Buscar plantillas</span>
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-primary"
                >
                  ⌕
                </span>
                <input
                  className="min-h-11 w-full rounded-lg border border-champagne-300 bg-surface/85 py-2 pr-4 pl-11 text-sm outline-none placeholder:text-muted sm:w-72"
                  name="busqueda"
                  defaultValue={search}
                  placeholder="Buscar plantillas..."
                  type="search"
                />
              </label>
              <label>
                <span className="sr-only">Ordenar plantillas</span>
                <select
                  className="min-h-11 w-full rounded-lg border border-champagne-300 bg-surface/85 px-4 py-2 text-sm text-foreground sm:w-52"
                  defaultValue={order === 'nombre' ? 'nombre' : 'popularidad'}
                  name="orden"
                >
                  <option value="popularidad">Más populares</option>
                  <option value="nombre">Nombre</option>
                </select>
              </label>
            </TemplateSearchForm>
          </div>

          {visibleTemplates.length === 0 ? (
            <p role="status" className="py-8 text-center text-foreground">
              No encontramos plantillas para esta búsqueda.{' '}
              <Link href="/plantillas" className="underline">
                Ver todas las plantillas
              </Link>
            </p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {visibleTemplates.map((template) => (
              <TemplateCard {...template} key={template.name} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
