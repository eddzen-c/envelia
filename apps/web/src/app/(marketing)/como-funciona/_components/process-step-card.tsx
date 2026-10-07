import Image from 'next/image';

type ProcessStepCardProps = Readonly<{
  description: string;
  image: string;
  imageAlt: string;
  number: number;
  title: string;
}>;

export function ProcessStepCard({
  description,
  image,
  imageAlt,
  number,
  title,
}: ProcessStepCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-champagne-300/65 bg-surface/96 shadow-[0_0.75rem_2rem_-1.65rem_rgb(59_20_36_/_28%)]">
      <div className="relative aspect-[1.92/1] overflow-hidden">
        <Image
          alt={imageAlt}
          className="object-cover transition-transform duration-700 ease-envelia group-hover:scale-[1.025] motion-reduce:transition-none"
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={image}
        />
      </div>

      <div className="relative min-h-[7.35rem] px-5 pt-3 pb-4">
        <span className="absolute top-0 left-5 grid size-10 -translate-y-[18%] place-items-center rounded-full border-[0.28rem] border-surface bg-primary font-display text-lg font-semibold text-primary-foreground shadow-[0_0.35rem_1rem_rgb(59_20_36_/_16%)]">
          {number}
        </span>
        <h3 className="pl-12 font-display text-[1.17rem] leading-tight font-semibold text-primary">
          {title}
        </h3>
        <p className="mt-1 pl-12 text-[0.82rem] leading-[1.35] text-foreground/76">{description}</p>
      </div>
    </article>
  );
}
