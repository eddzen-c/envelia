type ProcessBenefitProps = Readonly<{
  description: string;
  icon: 'diamond' | 'gift' | 'heart';
  title: string;
}>;

function BenefitIcon({ icon }: Readonly<Pick<ProcessBenefitProps, 'icon'>>) {
  if (icon === 'diamond') {
    return (
      <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
        <path d="m3.5 8 3-4h11l3 4L12 20 3.5 8Z" stroke="currentColor" strokeWidth="1.35" />
        <path
          d="m7 8 5 12 5-12M3.5 8h17M6.5 4 7 8l5-4 5 4 .5-4"
          stroke="currentColor"
          strokeWidth="1.15"
        />
      </svg>
    );
  }

  if (icon === 'gift') {
    return (
      <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 10h16v10H4V10Zm-1-4h18v4H3V6Zm9 0v14"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path
          d="M12 6c-4 0-5.2-1-5.2-2.4C6.8 2.7 7.5 2 8.5 2 10.2 2 12 6 12 6Zm0 0c4 0 5.2-1 5.2-2.4 0-.9-.7-1.6-1.7-1.6C13.8 2 12 6 12 6Z"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M20.8 5.8c-1.7-2.4-5.4-2.4-7.1-.2L12 8l-1.7-2.4c-1.7-2.2-5.4-2.2-7.1.2C.9 9 3.1 12.2 5 14.1l7 6.4 7-6.4c1.9-1.9 4.1-5.1 1.8-8.3Z"
        stroke="currentColor"
        strokeWidth="1.35"
      />
    </svg>
  );
}

export function ProcessBenefit({ description, icon, title }: ProcessBenefitProps) {
  return (
    <article className="flex items-start gap-2.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-champagne-400 text-champagne-700 [&>svg]:size-5">
        <BenefitIcon icon={icon} />
      </span>
      <div>
        <h3 className="font-display text-[0.82rem] leading-5 font-semibold text-primary">
          {title}
        </h3>
        <p className="text-[0.7rem] leading-4 text-foreground/70">{description}</p>
      </div>
    </article>
  );
}
