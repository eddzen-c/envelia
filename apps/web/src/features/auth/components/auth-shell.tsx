import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthShellProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  alternatePrompt: string;
  alternateLabel: string;
  alternateHref: string;
  children: ReactNode;
}>;

const experienceBenefits = [
  'Conserva todas tus invitaciones en un mismo espacio.',
  'Personaliza cada celebración a tu propio ritmo.',
  'Comparte experiencias memorables con tus invitados.',
] as const;

export function AuthShell({
  eyebrow,
  title,
  description,
  alternatePrompt,
  alternateLabel,
  alternateHref,
  children,
}: AuthShellProps) {
  return (
    <main
      className="relative isolate min-h-dvh overflow-hidden bg-background px-5 py-8 text-foreground sm:px-8 sm:py-10 lg:px-12"
      id="main-content"
    >
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 -z-10 size-80 rounded-full bg-brand-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 -z-10 size-96 rounded-full bg-champagne-200/60 blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <Link
          aria-label="Volver a la página de inicio de Envelia Studio"
          className="w-fit rounded-full font-display text-xl font-semibold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          href="/"
        >
          Envelia
          <span className="text-primary"> Studio</span>
        </Link>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] lg:gap-16 lg:py-16">
          <section
            aria-labelledby="auth-title"
            className="order-1 rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8 lg:order-2"
          >
            <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">{eyebrow}</p>

            <h1
              className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-foreground"
              id="auth-title"
            >
              {title}
            </h1>

            <p className="mt-4 leading-7 text-muted">{description}</p>

            <div className="mt-8">{children}</div>

            <p className="mt-7 border-t border-border pt-6 text-center text-sm text-muted">
              {alternatePrompt}{' '}
              <Link
                className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href={alternateHref}
              >
                {alternateLabel}
              </Link>
            </p>
          </section>

          <aside
            aria-label="Ventajas de tu cuenta de Envelia Studio"
            className="order-2 max-w-2xl lg:order-1"
          >
            <p className="text-sm font-bold tracking-[0.2em] text-primary uppercase">
              Tu celebración, en un solo lugar
            </p>

            <p className="mt-5 max-w-xl font-display text-4xl leading-tight font-semibold tracking-tight text-foreground sm:text-5xl">
              Da vida a cada detalle y vuelve cuando quieras.
            </p>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Tu cuenta conecta el diseño, la organización y la publicación de tus invitaciones sin
              perder el estilo personal de cada evento.
            </p>

            <ul className="mt-8 grid gap-4">
              {experienceBenefits.map((benefit) => (
                <li className="flex items-start gap-3 leading-7 text-foreground" key={benefit}>
                  <span
                    aria-hidden="true"
                    className="mt-2 size-2 shrink-0 rounded-full bg-champagne-500"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
