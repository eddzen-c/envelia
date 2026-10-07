import { PricingLineIcon } from './pricing-line-icon';

import type { PricingLineIconName } from './pricing-line-icon';

type PricingBenefitProps = Readonly<{
  description: string;
  icon: PricingLineIconName;
  title: string;
}>;

export function PricingBenefit({ description, icon, title }: PricingBenefitProps) {
  return (
    <article className="flex items-center gap-4 px-4 py-2 sm:border-l sm:border-champagne-300 first:border-l-0">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f3dcdc]/80 text-primary [&>svg]:size-7">
        <PricingLineIcon name={icon} />
      </span>
      <div>
        <h3 className="font-display text-base font-semibold text-primary">{title}</h3>
        <p className="mt-0.5 text-[0.72rem] leading-[1.35] text-foreground/72">{description}</p>
      </div>
    </article>
  );
}
