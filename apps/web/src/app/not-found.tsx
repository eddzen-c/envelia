import Link from 'next/link';

export default function NotFound() {
  return (
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

      <section aria-labelledby="not-found-title" className="relative mx-auto max-w-2xl text-center">
        <p
          aria-hidden="true"
          className="font-display text-8xl leading-none font-semibold text-brand-200 sm:text-9xl"
        >
          404
        </p>

        <p className="mt-7 text-sm font-bold tracking-[0.2em] text-primary uppercase">
          Página no encontrada
        </p>

        <h1
          className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
          id="not-found-title"
        >
          Esta invitación no está aquí.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">
          La dirección puede estar incompleta, haber cambiado o ya no estar disponible. Puedes
          regresar al inicio para continuar explorando Envelia Studio.
        </p>

        <Link
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-brand-700 motion-reduce:transition-none"
          href="/"
        >
          Volver al inicio
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>
    </main>
  );
}
