import type { Metadata } from 'next';
import Link from 'next/link';

import { InvitationDraftWorkspace } from '@/features/invitation-draft/components/invitation-draft-workspace';

export const metadata: Metadata = {
  title: 'Borrador de invitación | Envelia Studio',
  description:
    'Personaliza los datos principales de una invitación y observa su vista previa al instante.',
};

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-background text-foreground" id="main-content">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-10">
          <Link
            aria-label="Volver a la página de inicio de Envelia Studio"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted hover:bg-brand-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="/"
          >
            <span aria-hidden="true">←</span>
            Volver al inicio
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-bold tracking-[0.18em] text-primary uppercase">
              Envelia Studio
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight font-semibold sm:text-5xl">
              Diseña una invitación que se siente tuya
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Ajusta la información esencial, explora estilos cuidadosamente seleccionados y observa
              el resultado mientras escribes.
            </p>
          </div>
        </header>

        <section aria-label="Editor interactivo de invitaciones">
          <InvitationDraftWorkspace />
        </section>
      </div>
    </main>
  );
}
