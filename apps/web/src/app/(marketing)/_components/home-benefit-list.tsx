type BenefitIconName = 'heart' | 'diamond' | 'shield' | 'people';

const benefits = [
  { icon: 'heart', title: 'Diseños exclusivos', description: 'Creados para emocionar' },
  { icon: 'diamond', title: 'Fácil y rápido', description: 'Personaliza en minutos' },
  { icon: 'shield', title: 'Resultados profesionales', description: 'Cada detalle cuidado' },
  { icon: 'people', title: 'Para todos tus momentos', description: 'Celebra a tu manera' },
] as const satisfies readonly {
  icon: BenefitIconName;
  title: string;
  description: string;
}[];

const BenefitIcon = ({ name }: Readonly<{ name: BenefitIconName }>) => {
  if (name === 'heart') {
    return (
      <path d="M12 20.5S4 15.4 4 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.4c0 6-8 11.1-8 11.1Z" />
    );
  }

  if (name === 'diamond') {
    return <path d="m4 8 3-4h10l3 4-8 12L4 8Zm0 0h16M9 4l-2 4 5 12 5-12-2-4" />;
  }

  if (name === 'shield') {
    return <path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6l-7-3Zm-3 8 2 2 4-4" />;
  }

  return (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2" />
      <path d="M3 19c.6-4 2.5-6 6-6s5.4 2 6 6M15 14c3 0 4.7 1.7 5 5" />
    </>
  );
};

export function HomeBenefitList() {
  return (
    <ul
      aria-label="Beneficios de crear con Envelia"
      className="mt-10 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-champagne-300/70 pt-7 xl:grid-cols-4"
    >
      {benefits.map((benefit) => (
        <li className="flex min-w-0 items-center gap-3" key={benefit.title}>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-champagne-400 text-champagne-600">
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <BenefitIcon name={benefit.icon} />
            </svg>
          </span>
          <span>
            <strong className="block text-[0.66rem] leading-4 font-bold tracking-[0.08em] text-foreground uppercase">
              {benefit.title}
            </strong>
            <span className="mt-0.5 block text-[0.68rem] leading-4 text-muted">
              {benefit.description}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
