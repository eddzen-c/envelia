import Image from 'next/image';
import Link from 'next/link';

type InspirationCardProps = Readonly<{
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  variant: 'occasion' | 'idea';
}>;

export function InspirationCard({
  description,
  href,
  image,
  imageAlt,
  title,
  variant,
}: InspirationCardProps) {
  const isOccasion = variant === 'occasion';

  return (
    <article className="group overflow-hidden rounded-xl border border-champagne-200/70 bg-surface/92 shadow-[0_1rem_2.2rem_-1.5rem_rgb(59_20_36_/_32%)]">
      <Link
        aria-label={`${title}: ${description}`}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        href={href}
      >
        <div
          className={`relative overflow-hidden ${isOccasion ? 'aspect-[2.55]' : 'aspect-[1.4]'}`}
        >
          <Image
            alt={imageAlt}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
            fill
            sizes={
              isOccasion
                ? '(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw'
                : '(min-width: 1280px) 14vw, (min-width: 640px) 44vw, 100vw'
            }
            src={image}
          />
        </div>

        <div
          className={`flex items-center justify-between ${isOccasion ? 'gap-3 px-5 py-3' : 'gap-1.5 px-2.5 py-2'}`}
        >
          <div className="min-w-0">
            <h3
              className={`font-display leading-tight font-semibold text-primary ${
                isOccasion
                  ? 'text-xl'
                  : 'text-sm xl:whitespace-nowrap xl:text-[clamp(0.6875rem,0.85vw,0.875rem)]'
              }`}
            >
              {title}
            </h3>
            <p
              className={`mt-0.5 text-foreground/68 ${
                isOccasion
                  ? 'text-sm leading-5'
                  : 'text-xs leading-4 xl:text-[clamp(0.625rem,0.75vw,0.75rem)]'
              }`}
            >
              {description}
            </p>
          </div>

          <span
            aria-hidden="true"
            className={`grid shrink-0 place-items-center rounded-full bg-[#f9e7e3] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground ${
              isOccasion ? 'size-9 text-lg' : 'size-5 text-xs'
            }`}
          >
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
