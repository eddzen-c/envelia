import type { Metadata } from 'next';
import Image from 'next/image';

import { BotanicalDivider } from '../_components/botanical-divider';
import { PricingBenefit } from './_components/pricing-benefit';
import { PricingCard } from './_components/pricing-card';
import { PricingLineIcon } from './_components/pricing-line-icon';

const plans = [
  {
    artwork: '/assets/envelia/pricing/cards/basic-original-full.webp',
    callToAction: 'Comenzar ahora',
    description: 'Invitaciones digitales con toda la esencia de Envelia.',
    eyebrow: 'Ideal para momentos íntimos',
    features: [
      'Más de 50 plantillas premium',
      'Personaliza textos, colores y fotos',
      'Invitación digital lista para compartir',
      'Música de fondo básica',
      'Soporte por correo',
    ],
    href: '/crear-cuenta?plan=basico',
    name: 'Básico',
    price: '$19',
  },
  {
    artwork: '/assets/envelia/pricing/cards/premium-original-full.webp',
    callToAction: 'Elegir Premium',
    description: 'Más posibilidades para crear una experiencia única.',
    eyebrow: 'Para historias que marcan',
    featured: true,
    features: [
      'Más de 100 plantillas exclusivas',
      'Personalización completa',
      'Música personalizada',
      'Contador de cuenta regresiva',
      'Confirmación de asistencia (RSVP)',
      'Código QR para ubicación',
      'Soporte prioritario',
    ],
    href: '/crear-cuenta?plan=premium',
    name: 'Premium',
    price: '$39',
  },
  {
    artwork: '/assets/envelia/pricing/cards/pro-original-full.webp',
    callToAction: 'Elegir Pro',
    description: 'La experiencia más completa para un día extraordinario.',
    eyebrow: 'Para celebraciones inolvidables',
    features: [
      'Todas las plantillas premium',
      'Personalización avanzada',
      'Música personalizada',
      'Contador de cuenta regresiva',
      'Confirmación de asistencia (RSVP)',
      'Código QR para ubicación',
      'Galería de fotos de la celebración',
      'Dominio personalizado (tudominio.com)',
      'Soporte VIP y asesoría personalizada',
    ],
    href: '/crear-cuenta?plan=pro',
    name: 'Pro',
    price: '$59',
  },
] as const;

const benefits = [
  {
    description: 'Tu invitación permanece disponible siempre.',
    icon: 'infinity',
    title: 'Sin límites de tiempo',
  },
  {
    description: 'Luce perfecta en cualquier dispositivo.',
    icon: 'phone',
    title: 'Diseño adaptable',
  },
  {
    description: 'Tu información está protegida en todo momento.',
    icon: 'shield',
    title: 'Pagos seguros',
  },
  {
    description: 'Miles de historias ya comenzaron con Envelia.',
    icon: 'heart',
    title: 'Momentos reales',
  },
] as const;

export const metadata: Metadata = {
  title: 'Precios | Envelia Studio',
  description:
    'Compara los planes de Envelia Studio y elige la experiencia ideal para tu invitación digital.',
};

export default function PricingPage() {
  return (
    <main className="relative isolate overflow-hidden bg-surface" id="main-content">
      <Image
        alt=""
        aria-hidden="true"
        className="-z-30 object-cover object-top"
        data-testid="pricing-background"
        fill
        priority
        sizes="100vw"
        src="/assets/envelia/pricing/background.webp"
      />

      <section
        aria-labelledby="pricing-title"
        className="relative isolate min-h-[22rem] overflow-hidden px-5 pt-28 sm:px-8 lg:px-12"
      >
        <div className="mx-auto grid min-h-[16rem] max-w-[22rem] items-center xl:max-w-[68.5rem] xl:grid-cols-[58%_42%]">
          <div className="relative z-10 max-w-[38rem] pb-6">
            <p className="text-[0.68rem] font-semibold tracking-[0.38em] text-foreground/62 uppercase">
              Planes que celebran lo extraordinario
            </p>
            <h1
              className="mt-2 font-display text-[clamp(1.9rem,8.2vw,3rem)] leading-[0.94] font-semibold tracking-[-0.045em] text-primary xl:text-[4rem]"
              id="pricing-title"
            >
              <span className="block whitespace-nowrap">Invitaciones tan</span>{' '}
              <span className="block whitespace-nowrap">especiales como tu historia</span>
            </h1>
            <p className="mt-3 max-w-[40rem] text-base leading-7 text-foreground/78">
              <span className="xl:block xl:whitespace-nowrap">
                Elige el plan ideal y diseña invitaciones digitales elegantes,
              </span>{' '}
              <span className="xl:block xl:whitespace-nowrap">
                personales y memorables para cada momento de tu vida
              </span>
            </p>

            <ul className="mt-5 grid max-w-[34rem] gap-3 sm:grid-cols-3">
              <li className="flex items-center gap-3 sm:border-r sm:border-champagne-400 sm:pr-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-champagne-600 text-champagne-700 [&>svg]:size-6">
                  <PricingLineIcon name="heart" />
                </span>
                <span className="text-[0.65rem] leading-4 font-semibold tracking-wide text-foreground/72 uppercase">
                  Diseños exclusivos
                </span>
              </li>
              <li className="flex items-center gap-3 sm:border-r sm:border-champagne-400 sm:pr-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-champagne-600 text-champagne-700 [&>svg]:size-6">
                  <PricingLineIcon name="diamond" />
                </span>
                <span className="text-[0.65rem] leading-4 font-semibold tracking-wide text-foreground/72 uppercase">
                  Fácil y rápido
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-champagne-600 text-champagne-700 [&>svg]:size-6">
                  <PricingLineIcon name="shield" />
                </span>
                <span className="text-[0.65rem] leading-4 font-semibold tracking-wide text-foreground/72 uppercase">
                  Resultados profesionales
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-label="Planes disponibles" className="relative px-5 pb-4 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[22rem] gap-5 xl:max-w-[68.5rem] xl:grid-cols-3 xl:items-start">
          {plans.map((plan) => (
            <PricingCard {...plan} key={plan.name} />
          ))}
        </div>
      </section>

      <section aria-label="Beneficios incluidos" className="px-5 py-3 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[72rem] gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <PricingBenefit {...benefit} key={benefit.title} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="pricing-closing-title"
        className="px-5 pt-2 pb-5 text-center sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-[58rem]">
          <BotanicalDivider className="text-champagne-600" />
          <p className="mt-1 text-[0.62rem] font-semibold tracking-[0.34em] text-champagne-700 uppercase">
            Más que invitaciones
          </p>
          <h2
            className="mt-1 font-display text-3xl font-semibold text-primary"
            id="pricing-closing-title"
          >
            Diseño que convierte momentos en <em className="font-normal">recuerdos eternos.</em>
          </h2>
          <p className="mx-auto mt-1 max-w-3xl text-sm leading-6 text-foreground/72">
            En Envelia Studio creemos que cada celebración merece un detalle único. Nuestros planes
            se adaptan a cada historia, para que puedas compartirla de una manera tan especial como
            la imaginas.
          </p>
        </div>
      </section>
    </main>
  );
}
