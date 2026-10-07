import Image from 'next/image';
import Link from 'next/link';

type TemplateCardProps = Readonly<{
  category: string;
  image: string;
  name: string;
}>;

export function TemplateCard({ category, image, name }: TemplateCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-champagne-200 bg-surface shadow-soft">
      <Link aria-label={`Explorar plantilla ${name}`} className="block" href="/crear-cuenta">
        <div className="relative aspect-[1.28/1] overflow-hidden">
          <Image
            alt={`Vista previa de la plantilla ${name}`}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transition-none"
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 100vw"
            src={image}
          />
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-primary">{name}</h3>
            <p className="mt-0.5 text-[0.65rem] font-semibold tracking-[0.2em] text-muted uppercase">
              {category}
            </p>
          </div>
          <span aria-hidden="true" className="text-2xl text-primary">
            ♡
          </span>
        </div>
      </Link>
    </article>
  );
}
