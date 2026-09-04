'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import './globals.css';

type GlobalErrorProps = Readonly<{
  error: Error & {
    digest?: string;
  };
  retry: () => void;
}>;

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es-MX">
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <title>Error inesperado | Envelia Studio</title>

        <main
          className="relative grid min-h-dvh place-items-center overflow-hidden px-5 py-16"
          id="main-content"
        >
          <div
            aria-hidden="true"
            className="absolute -top-32 -right-32 size-80 rounded-full bg-brand-200/50 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-40 -left-40 size-96 rounded-full bg-champagne-200/60 blur-3xl"
          />

          <section
            aria-labelledby="global-error-title"
            className="relative mx-auto max-w-2xl text-center"
            role="alert"
          >
            <div
              aria-hidden="true"
              className="mx-auto grid size-20 place-items-center rounded-full border border-champagne-300 bg-champagne-50 font-display text-4xl font-semibold text-champagne-800"
            >
              !
            </div>

            <p className="mt-7 text-sm font-bold tracking-[0.2em] text-primary uppercase">
              Error de aplicación
            </p>

            <h1
              className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
              id="global-error-title"
            >
              Envelia necesita volver a intentarlo.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">
              Ocurrió un problema al preparar la aplicación. Puedes intentar recuperarla o regresar
              al inicio.
            </p>

            {error.digest ? (
              <p className="mt-5 text-sm text-muted">
                Referencia del incidente:{' '}
                <code className="rounded bg-surface-muted px-2 py-1 font-mono text-xs text-foreground">
                  {error.digest}
                </code>
              </p>
            ) : null}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-brand-700 motion-reduce:transition-none"
                onClick={retry}
                type="button"
              >
                Intentar recuperar
              </button>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-300 hover:bg-brand-50 motion-reduce:transition-none"
                href="/"
              >
                Volver al inicio
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
