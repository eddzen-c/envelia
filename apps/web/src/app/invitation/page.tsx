import type { Metadata } from 'next';
import Link from 'next/link';

import { PortableInvitationView } from '@/features/invitation-draft/components/portable-invitation-view';

export const metadata: Metadata = {
  title: 'Invitación compartida | Envelia Studio',
  description:
    'Abre una invitación digital compartida mediante un enlace portable de Envelia Studio.',
};

export default function InvitationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground" id="main-content">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-10">
          <Link
            aria-label="Volver a la página de inicio de Envelia Studio"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted hover:bg-brand-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="/"
          >
            <span aria-hidden="true">←</span>
            Volver al inicio
          </Link>

          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="text-sm font-bold tracking-[0.18em] text-primary uppercase">
              Envelia Studio
            </p>

            <h1 className="mt-3 font-display text-4xl leading-tight font-semibold sm:text-5xl">
              Una invitación para ti
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              El contenido de esta invitación viaja dentro del enlace y se procesa únicamente en tu
              navegador.
            </p>
          </div>
        </header>

        <PortableInvitationView />
      </div>
    </main>
  );
}
