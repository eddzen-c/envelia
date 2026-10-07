import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { href: '/plantillas', icon: 'category-all.webp', label: 'Todos' },
  { href: '/plantillas?categoria=bodas', icon: 'category-wedding.webp', label: 'Bodas' },
  { href: '/plantillas?categoria=xv', icon: 'category-xv.webp', label: 'XV Años' },
  {
    href: '/plantillas?categoria=cumpleanos',
    icon: 'category-birthday.webp',
    label: 'Cumpleaños',
  },
  {
    href: '/plantillas?categoria=bautizos',
    icon: 'category-baptism.webp',
    label: 'Bautizos',
  },
  {
    href: '/plantillas?categoria=comuniones',
    icon: 'category-communion.webp',
    label: 'Comuniones',
  },
  {
    href: '/plantillas?categoria=empresariales',
    icon: 'category-business.webp',
    label: 'Eventos empresariales',
  },
  {
    href: '/plantillas?categoria=especiales',
    icon: 'category-special.webp',
    label: 'Fechas especiales',
  },
] as const;

export function TemplateCategoryFilter({
  activeCategory = '',
}: Readonly<{ activeCategory?: string }>) {
  return (
    <nav aria-label="Filtrar plantillas por ocasión" className="overflow-x-auto pb-1">
      <ul className="mx-auto flex w-max min-w-full items-center justify-start gap-3 lg:justify-center">
        {categories.map((category) => (
          <li key={category.href}>
            <Link
              aria-current={
                (new URL(category.href, 'https://envelia.invalid').searchParams.get('categoria') ??
                  '') === activeCategory
                  ? 'page'
                  : undefined
              }
              className="inline-flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-full border border-champagne-300/80 bg-surface/80 px-5 py-2 text-sm text-foreground/80 transition-colors hover:border-primary hover:text-primary aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
              href={category.href}
            >
              <Image
                alt=""
                aria-hidden="true"
                className="size-6 object-contain"
                height={224}
                src={`/assets/envelia/icons/${category.icon}`}
                width={224}
              />
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
