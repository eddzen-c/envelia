import Image from 'next/image';
import Link from 'next/link';

type PricingCardProps = Readonly<{
  artwork: string;
  callToAction: string;
  description: string;
  eyebrow: string;
  features: readonly string[];
  featured?: boolean;
  href: string;
  name: string;
  price: string;
}>;

export function PricingCard({
  artwork,
  callToAction,
  description,
  eyebrow,
  features,
  featured = false,
  href,
  name,
  price,
}: PricingCardProps) {
  const featureInsets = featured
    ? { marginLeft: '24%', marginRight: '18%' }
    : name === 'Pro'
      ? { marginLeft: '30%', marginRight: '8%' }
      : { marginLeft: '28%', marginRight: '22%' };

  return (
    <article
      className={`relative isolate w-full max-w-[22rem] self-start justify-self-center rounded-2xl shadow-[0_1.3rem_2.8rem_-1.55rem_rgb(59_20_36_/_38%)] ${
        featured ? 'xl:-translate-y-3' : ''
      }`}
      style={{ containerType: 'inline-size' }}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="block rounded-2xl"
        data-testid="pricing-card-artwork"
        height={1536}
        src={artwork}
        style={{ display: 'block', width: '100%', height: 'auto' }}
        unoptimized
        width={1024}
      />

      <h2 className="sr-only">{name}</h2>
      <p className="sr-only">{eyebrow}</p>
      {featured ? <span className="sr-only">Más popular</span> : null}

      <div
        className={`absolute inset-x-0 z-10 flex flex-col ${
          featured ? 'top-[25.5%] bottom-[16%]' : 'top-[35.5%] bottom-[5.2%]'
        }`}
      >
        <p className="text-center font-display text-[8.4cqw] leading-none font-semibold text-primary">
          {price} <span className="text-[4.55cqw] font-normal">USD</span>
        </p>
        <p className="mx-auto mt-[1cqw] w-[54%] text-center text-[3.45cqw] leading-[1.25] text-foreground/78">
          {description}
        </p>

        <ul className="mt-[2cqw] space-y-[1cqw]" style={featureInsets}>
          {features.map((feature) => (
            <li
              className="flex gap-[2.27cqw] text-[3.14cqw] leading-[1.18] text-foreground/82"
              key={feature}
            >
              <span
                aria-hidden="true"
                className="mt-px grid size-[4cqw] shrink-0 place-items-center rounded-full bg-champagne-500 text-[2.36cqw] font-bold text-white"
              >
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <Link
          className={`relative z-20 mx-auto mt-auto inline-flex min-h-[10.25cqw] w-[62%] shrink-0 items-center justify-center gap-[2.27cqw] rounded-full border px-[3.4cqw] py-[2.27cqw] text-[3.55cqw] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
            featured
              ? 'border-primary bg-primary text-primary-foreground hover:bg-brand-900'
              : 'border-champagne-600 bg-surface/75 text-primary hover:bg-champagne-50'
          }`}
          href={href}
        >
          {callToAction} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
