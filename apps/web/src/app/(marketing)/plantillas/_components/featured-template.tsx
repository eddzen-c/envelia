import Image from 'next/image';
import Link from 'next/link';

import { TemplateLineIcon } from './template-line-icon';

import type { TemplateLineIconName } from './template-line-icon';

const benefits = [
  { icon: 'diamond', label: 'Diseño exclusivo' },
  { icon: 'monitor', label: 'Fácil de personalizar' },
  { icon: 'heart', label: 'Lista para compartir' },
] as const satisfies readonly { icon: TemplateLineIconName; label: string }[];

export function FeaturedTemplate() {
  return (
    <article className="overflow-hidden rounded-[1.15rem] border border-champagne-300/65 bg-surface/90 shadow-soft">
      <div className="grid lg:grid-cols-[0.74fr_1.26fr]">
        <div className="relative z-20 flex flex-col justify-center px-7 py-6 sm:px-9 lg:min-h-[15.5rem] lg:px-9 lg:py-5">
          <p className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.3em] text-champagne-700 uppercase">
            <Image
              alt=""
              aria-hidden="true"
              className="size-5 object-contain"
              height={224}
              src="/assets/envelia/icons/category-xv.webp"
              width={224}
            />
            Plantilla destacada
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none font-semibold text-primary">
            Jardín Dorado
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-5 text-foreground/75 sm:text-base sm:leading-6">
            Elegancia atemporal con delicadas flores y detalles dorados, perfecta para una boda
            inolvidable.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground/75">
            {benefits.map((benefit) => (
              <li className="flex items-center gap-2" key={benefit.label}>
                <TemplateLineIcon className="size-5 text-champagne-600" name={benefit.icon} />
                {benefit.label}
              </li>
            ))}
          </ul>
          <Link
            className="mt-4 inline-flex min-h-10 w-fit items-center gap-8 rounded-full bg-primary px-7 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-900"
            href="/crear-cuenta"
          >
            Ver plantilla <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative grid min-h-[22rem] grid-cols-2 gap-1 bg-champagne-100 p-1 sm:grid-cols-[1.62fr_0.56fr_0.72fr] lg:min-h-[15.5rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-36 bg-gradient-to-r from-surface via-surface/80 to-transparent lg:block"
          />
          <div className="relative col-span-2 min-h-60 overflow-hidden sm:col-span-1 sm:min-h-full">
            <Image
              alt="Invitación Jardín Dorado para Valeria y Santiago"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              src="/assets/envelia/templates/wedding-closeup.webp"
            />
          </div>
          <div className="relative min-h-52 overflow-hidden sm:min-h-full">
            <Image
              alt="Tarjeta con detalles del evento de Jardín Dorado"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 14vw, 50vw"
              src="/assets/envelia/templates/event-details.webp"
            />
          </div>
          <div className="relative min-h-52 overflow-hidden sm:min-h-full">
            <Image
              alt="Tarjeta de agradecimiento de Jardín Dorado"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 16vw, 50vw"
              src="/assets/envelia/templates/thank-you.webp"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
