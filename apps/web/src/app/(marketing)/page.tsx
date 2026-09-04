const experienceItems = [
  {
    step: '01',
    title: 'Elige',
    description: 'Parte de una experiencia diseñada para el estilo de tu celebración.',
  },
  {
    step: '02',
    title: 'Personaliza',
    description: 'Adapta textos, colores, momentos y detalles desde un solo lugar.',
  },
  {
    step: '03',
    title: 'Comparte',
    description: 'Envía una invitación digital memorable y recibe las respuestas.',
  },
] as const;

export default function HomePage() {
  return (
    <main id="main-content">
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-32 -z-10 size-80 rounded-full bg-brand-200/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-40 -z-10 size-96 rounded-full bg-champagne-200/50 blur-3xl"
        />

        <div className="mx-auto grid min-h-[calc(100dvh-5rem)] w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-bold tracking-[0.2em] text-primary uppercase">
              Diseña · Personaliza · Celebra
            </p>

            <h1
              className="font-display text-5xl leading-[0.98] font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              id="hero-title"
            >
              Invitaciones digitales <span className="text-primary">que cobran vida.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
              Crea experiencias memorables para tus invitados, personaliza cada detalle y administra
              tu celebración desde un mismo lugar.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-brand-700 motion-reduce:transition-none"
                href="#experiencia"
              >
                Descubrir la experiencia
                <span aria-hidden="true">&rarr;</span>
              </a>

              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-300 hover:bg-brand-50 motion-reduce:transition-none"
                href="#muestra"
              >
                Ver muestra conceptual
              </a>
            </div>
          </div>

          <aside
            aria-label="Muestra conceptual de una invitación digital"
            className="relative mx-auto w-full max-w-md"
            id="muestra"
          >
            <div
              aria-hidden="true"
              className="absolute inset-5 -z-10 rotate-3 rounded-card bg-brand-200/60"
            />

            <div className="rounded-card border border-champagne-200 bg-surface p-6 shadow-soft sm:p-8">
              <div className="rounded-[1.25rem] border border-champagne-200 bg-background px-6 py-12 text-center sm:px-8 sm:py-16">
                <p className="text-xs font-bold tracking-[0.24em] text-champagne-700 uppercase">
                  Una historia comienza
                </p>

                <p className="mt-7 font-display text-4xl font-semibold text-foreground sm:text-5xl">
                  Andrea
                  <span className="block py-2 text-2xl text-primary">&amp;</span>
                  Mateo
                </p>

                <div aria-hidden="true" className="mx-auto my-7 h-px w-20 bg-champagne-400" />

                <p className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">
                  18 · Octubre · 2026
                </p>

                <p className="mt-5 text-sm leading-6 text-muted">
                  Cada detalle, cada momento y cada invitado en una experiencia creada para
                  recordar.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        aria-labelledby="experience-title"
        className="border-y border-border bg-surface"
        id="experiencia"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-[0.2em] text-primary uppercase">
              Una experiencia sencilla
            </p>

            <h2
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              id="experience-title"
            >
              De la idea a tus invitados
            </h2>
          </div>

          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {experienceItems.map((item) => (
              <li className="rounded-card border border-border bg-background p-6" key={item.step}>
                <span className="text-sm font-bold text-champagne-700">{item.step}</span>

                <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-muted">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
