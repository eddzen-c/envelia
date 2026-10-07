import Image from 'next/image';
import Link from 'next/link';

type HomeDiscoveryCardProps = Readonly<{
  description: string;
  href: string;
  image: string;
  title: string;
}>;

export function HomeDiscoveryCard({ description, href, image, title }: HomeDiscoveryCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.25rem] border border-champagne-200 bg-surface shadow-soft transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none">
      <div className="relative aspect-[1.55/1] overflow-hidden">
        <Image
          alt=""
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={image}
        />
      </div>
      <div className="flex items-center justify-between gap-4 p-5">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-muted">{description}</p>
        </div>
        <Link
          aria-label={`Explorar ${title}`}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-100 text-xl text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground focus-visible:outline-primary motion-reduce:transition-none"
          href={href}
        >
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
