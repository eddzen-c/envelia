import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { BotanicalDivider } from '../_components/botanical-divider';
import { ProcessBenefit } from './_components/process-benefit';
import { ProcessStepCard } from './_components/process-step-card';

export const metadata: Metadata = {
  title: 'Cómo funciona | Envelia Studio',
  description:
    'Descubre cómo crear, personalizar y compartir una invitación digital en Envelia Studio.',
};

const processSteps = [
  {
    description:
      'Explora nuestra colección de diseños exclusivos y encuentra el estilo perfecto para tu ocasión.',
    image: '/assets/envelia/how-it-works/style-collection.webp',
    imageAlt: 'Colección de invitaciones florales de Envelia Studio',
    number: 1,
    title: 'Elige tu plantilla',
  },
  {
    description:
      'Edita textos, colores e imágenes de forma sencilla para hacerla única y totalmente tuya.',
    image: '/assets/envelia/how-it-works/edit-and-save.webp',
    imageAlt: 'Editor visual de una invitación floral',
    number: 2,
    title: 'Personaliza los detalles',
  },
  {
    description:
      'Obtén un enlace único y comparte tu invitación por WhatsApp, redes sociales o correo electrónico.',
    image: '/assets/envelia/how-it-works/share-mobile.webp',
    imageAlt: 'Invitación móvil preparada para compartir',
    number: 3,
    title: 'Comparte tu invitación',
  },
  {
    description:
      'Recibe y organiza las confirmaciones de tus invitados en tiempo real, todo en un solo lugar.',
    image: '/assets/envelia/how-it-works/rsvp.webp',
    imageAlt: 'Panel de confirmaciones de asistencia',
    number: 4,
    title: 'Gestiona tus confirmaciones',
  },
] as const;

const quickBenefits = [
  { icon: 'diamond', label: 'Rápido y sencillo' },
  { icon: 'heart', label: 'Diseños exclusivos' },
  { icon: 'shield', label: 'Resultados profesionales' },
  { icon: 'people', label: 'Para todos tus momentos' },
] as const;

function QuickBenefitIcon({ icon }: Readonly<{ icon: (typeof quickBenefits)[number]['icon'] }>) {
  if (icon === 'diamond') {
    return (
      <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
        <path
          d="m3.5 8 3-4h11l3 4L12 20 3.5 8Zm0 0h17M7 8l5 12 5-12"
          stroke="currentColor"
          strokeWidth="1.35"
        />
      </svg>
    );
  }

  if (icon === 'heart') {
    return (
      <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
        <path
          d="M20.7 5.7c-1.7-2.2-5-2.2-6.7 0L12 8.3 10 5.7c-1.7-2.2-5-2.2-6.7 0-2.2 2.8-.2 6 1.7 7.9l7 6.2 7-6.2c1.9-1.9 3.9-5.1 1.7-7.9Z"
          stroke="currentColor"
          strokeWidth="1.35"
        />
      </svg>
    );
  }

  if (icon === 'shield') {
    return (
      <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 2.7 20 6v5.6c0 4.8-3.2 8.1-8 9.7-4.8-1.6-8-4.9-8-9.7V6l8-3.3Z"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.35" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="16.5" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.8 19c.5-3.8 2.2-5.8 5.2-5.8s4.7 2 5.2 5.8M13 14c3.8-.8 6.8.9 7.7 4.4"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export default function HowItWorksPage() {
  return (
    <main id="main-content">
      <section
        aria-labelledby="how-it-works-title"
        className="relative isolate overflow-hidden bg-[#fbf5ea]"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="-z-20 object-cover object-center"
          fill
          loading="eager"
          sizes="100vw"
          src="/assets/envelia/how-it-works/hero-background-v2.webp"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-background/72 sm:bg-[linear-gradient(90deg,rgb(251_247_239_/_92%)_0%,rgb(251_247_239_/_76%)_54%,rgb(251_247_239_/_18%)_82%,transparent_100%)] lg:bg-transparent"
        />

        <div className="relative mx-auto min-h-[43rem] max-w-[128rem] lg:aspect-[2048/682] lg:min-h-0">
          <div className="relative z-10 flex min-h-[43rem] items-center px-5 pt-28 pb-10 sm:px-8 lg:absolute lg:inset-y-0 lg:left-0 lg:min-h-0 lg:w-[51%] lg:items-start lg:px-0 lg:pt-[clamp(6.75rem,8.6vw,7.85rem)] lg:pr-0 lg:pb-4 lg:pl-[clamp(5rem,11.35vw,10.3rem)]">
            <div className="w-full max-w-[35rem]">
              <p className="text-xs font-semibold tracking-[0.36em] text-foreground/62 uppercase">
                Un proceso simple y especial
              </p>
              <h1
                className="mt-2 font-display text-[3rem] leading-[0.92] font-semibold tracking-[-0.045em] text-primary sm:text-6xl xl:text-[4rem]"
                id="how-it-works-title"
              >
                Cómo funciona <span className="block">en Envelia Studio</span>
              </h1>
              <p className="mt-2 max-w-[34rem] text-base leading-7 text-foreground/76 sm:text-lg xl:text-[1.12rem] xl:leading-[1.42]">
                Crea invitaciones digitales elegantes en pocos pasos y vive la experiencia de
                compartir momentos únicos de una manera inolvidable.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-4 rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-brand-900"
                  href="/crear-cuenta"
                >
                  <span aria-hidden="true" className="text-champagne-300">
                    ✦
                  </span>
                  Crear mi invitación <span aria-hidden="true">→</span>
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-champagne-500 bg-surface/70 px-7 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-champagne-50"
                  href="/plantillas"
                >
                  Ver plantillas
                </Link>
              </div>

              <ul className="mt-4 grid grid-cols-2 border-t border-champagne-400/45 pt-3 lg:grid-cols-4">
                {quickBenefits.map((benefit) => (
                  <li
                    className="flex min-h-11 items-center gap-1.5 border-l border-champagne-300 px-1.5 text-[0.58rem] leading-4 font-semibold tracking-wide text-foreground/72 uppercase first:border-l-0 first:pl-0"
                    key={benefit.label}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-champagne-400 text-champagne-700 [&>svg]:size-5">
                      <QuickBenefitIcon icon={benefit.icon} />
                    </span>
                    {benefit.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="process-title"
        className="relative isolate overflow-hidden bg-background px-5 pt-7 pb-0 sm:px-8 lg:px-12"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 overflow-hidden xl:bottom-[7.35rem]"
        >
          <Image
            alt=""
            className="object-cover object-center"
            fill
            sizes="100vw"
            src="/assets/envelia/how-it-works/process-background-v2.webp"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-background/10 xl:bottom-[7.35rem]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-20 hidden h-[7.35rem] overflow-hidden xl:block"
        >
          <Image
            alt=""
            className="object-fill"
            fill
            sizes="100vw"
            src="/assets/envelia/how-it-works/benefits-background-overlap.webp"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 hidden h-[7.35rem] bg-surface/8 xl:block"
        />
        <div className="mx-auto max-w-[90rem]">
          <BotanicalDivider className="text-champagne-600" />
          <p className="mt-1 text-center text-[0.68rem] font-semibold tracking-[0.34em] text-champagne-700 uppercase">
            Tu invitación en 4 pasos
          </p>
          <h2
            className="mt-1 text-center font-display text-3xl font-semibold text-primary sm:text-[2.6rem]"
            id="process-title"
          >
            Así de fácil es crear <em className="font-normal">momentos inolvidables</em>
          </h2>
          <p className="mx-auto mt-1 max-w-3xl text-center text-sm leading-6 text-foreground/68">
            Un proceso pensado para que disfrutes cada etapa, desde la idea hasta la celebración.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => (
              <ProcessStepCard {...step} key={step.number} />
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="process-benefits-title"
        className="relative isolate min-h-[7.25rem] overflow-hidden bg-surface px-5 py-3 sm:px-8 lg:px-12"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="-z-20 object-fill"
          fill
          sizes="100vw"
          src="/assets/envelia/how-it-works/benefits-background-cropped.webp"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-surface/8" />
        <div className="mx-auto grid max-w-[54rem] items-center gap-5 xl:grid-cols-[18.5rem_1fr]">
          <div>
            <p className="text-[0.62rem] font-semibold tracking-[0.31em] text-champagne-700 uppercase">
              Más que una invitación
            </p>
            <h2
              className="mt-1 font-display text-[1.75rem] leading-[0.98] font-semibold text-primary"
              id="process-benefits-title"
            >
              Diseñado para momentos{' '}
              <em className="block font-normal">que se viven para siempre.</em>
            </h2>
          </div>
          <div className="grid gap-4 border-champagne-300 sm:grid-cols-3 xl:border-l xl:pl-6">
            <ProcessBenefit
              description="Crea tu invitación sin complicaciones."
              icon="heart"
              title="Experiencia intuitiva"
            />
            <ProcessBenefit
              description="Diseños que reflejan la esencia de tu historia."
              icon="diamond"
              title="Resultados elegantes"
            />
            <ProcessBenefit
              description="Comparte la belleza de tus nuevos comienzos."
              icon="gift"
              title="Momentos que inspiran"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
