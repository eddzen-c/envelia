import Image from 'next/image';

type BotanicalDividerProps = Readonly<{
  className?: string;
}>;

export function BotanicalDivider({ className = '' }: BotanicalDividerProps) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-20 bg-current opacity-55 sm:w-24" />
      <Image
        alt=""
        className="size-9 shrink-0 object-contain"
        height={224}
        src="/assets/envelia/icons/botanical-leaf.webp"
        width={224}
      />
      <span className="h-px w-20 bg-current opacity-55 sm:w-24" />
    </div>
  );
}
