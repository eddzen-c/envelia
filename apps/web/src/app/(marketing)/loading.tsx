export default function Loading() {
  return (
    <main aria-busy="true" className="min-h-dvh bg-background" id="main-content">
      <p aria-live="polite" className="sr-only" role="status">
        Cargando Envelia Studio…
      </p>

      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="border-b border-border/70">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
            <div className="h-7 w-36 rounded-full bg-surface-muted" />
            <div className="h-8 w-28 rounded-full bg-champagne-100" />
          </div>
        </div>

        <div className="mx-auto grid min-h-[calc(100dvh-5rem)] w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div>
            <div className="h-4 w-56 max-w-full rounded-full bg-brand-100" />

            <div className="mt-7 space-y-4">
              <div className="h-14 w-full max-w-lg rounded-2xl bg-surface-muted sm:h-16" />
              <div className="h-14 w-4/5 rounded-2xl bg-surface-muted sm:h-16" />
              <div className="h-14 w-3/5 rounded-2xl bg-brand-100 sm:h-16" />
            </div>

            <div className="mt-8 space-y-3">
              <div className="h-5 w-full max-w-xl rounded-full bg-surface-muted" />
              <div className="h-5 w-5/6 rounded-full bg-surface-muted" />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <div className="h-12 w-full rounded-full bg-brand-200 sm:w-52" />
              <div className="h-12 w-full rounded-full bg-surface-muted sm:w-48" />
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-card border border-champagne-200 bg-surface p-6 shadow-soft sm:p-8">
            <div className="rounded-[1.25rem] border border-champagne-200 bg-background px-6 py-12 sm:px-8 sm:py-16">
              <div className="mx-auto h-3 w-40 rounded-full bg-champagne-100" />
              <div className="mx-auto mt-10 h-12 w-44 rounded-2xl bg-surface-muted" />
              <div className="mx-auto mt-4 size-8 rounded-full bg-brand-100" />
              <div className="mx-auto mt-4 h-12 w-40 rounded-2xl bg-surface-muted" />
              <div className="mx-auto mt-8 h-px w-20 bg-champagne-300" />
              <div className="mx-auto mt-8 h-3 w-36 rounded-full bg-surface-muted" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
