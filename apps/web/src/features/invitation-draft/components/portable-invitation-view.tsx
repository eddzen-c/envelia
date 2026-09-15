'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { createInvitationPreview } from '../model/invitation-draft';
import {
  parsePortableInvitationPayload,
  type PortableInvitationParseResult,
} from '../model/invitation-draft-portable-link';
import { InvitationPreviewCard } from './invitation-preview-card';

type PortableInvitationViewProps = Readonly<{
  fragment?: string;
}>;

type PortableInvitationViewState =
  | Readonly<{
      status: 'checking';
      draft: null;
    }>
  | PortableInvitationParseResult;

type PortableInvitationFailureStatus = Exclude<PortableInvitationParseResult['status'], 'decoded'>;

const portableInvitationFailureMessages: Record<
  PortableInvitationFailureStatus,
  Readonly<{
    title: string;
    description: string;
  }>
> = {
  empty: {
    title: 'El enlace está incompleto',
    description:
      'No encontramos los datos de la invitación en este enlace. Solicita nuevamente el enlace completo.',
  },
  invalid: {
    title: 'No pudimos abrir esta invitación',
    description:
      'El enlace parece estar dañado o modificado. Tus datos locales permanecen intactos.',
  },
  unsupported: {
    title: 'Esta invitación usa una versión no compatible',
    description:
      'El enlace fue creado con un formato distinto al que esta versión de Envelia Studio reconoce.',
  },
  'too-large': {
    title: 'El enlace supera el tamaño permitido',
    description: 'Por seguridad, Envelia Studio no procesó el contenido de esta invitación.',
  },
};

export function PortableInvitationView({ fragment }: PortableInvitationViewProps) {
  const [viewState, setViewState] = useState<PortableInvitationViewState>({
    status: 'checking',
    draft: null,
  });

  useEffect(() => {
    let isActive = true;

    const updateFromFragment = (nextFragment: string) => {
      if (!isActive) {
        return;
      }

      setViewState(parsePortableInvitationPayload(nextFragment));
    };

    if (fragment !== undefined) {
      queueMicrotask(() => {
        updateFromFragment(fragment);
      });

      return () => {
        isActive = false;
      };
    }

    const readBrowserFragment = () => {
      updateFromFragment(window.location.hash);
    };

    window.addEventListener('hashchange', readBrowserFragment);

    queueMicrotask(() => {
      readBrowserFragment();
    });

    return () => {
      isActive = false;
      window.removeEventListener('hashchange', readBrowserFragment);
    };
  }, [fragment]);

  if (viewState.status === 'checking') {
    return (
      <section
        aria-label="Estado de la invitación"
        className="rounded-[2rem] border border-border bg-surface p-8 text-center shadow-soft"
      >
        <p aria-atomic="true" className="text-sm font-semibold text-muted" role="status">
          Abriendo la invitación…
        </p>
      </section>
    );
  }

  if (viewState.status === 'decoded') {
    const preview = createInvitationPreview(viewState.draft);

    return (
      <section aria-label="Contenido de la invitación compartida">
        <InvitationPreviewCard presentation="shared" preview={preview} />

        <aside className="mt-6 rounded-[1.5rem] border border-border bg-surface p-6 text-center">
          <p className="font-display text-xl font-semibold text-foreground">
            ¿También quieres crear una invitación?
          </p>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
            Diseña tu propia versión en Envelia Studio. Esta invitación compartida no modifica los
            borradores guardados en tu navegador.
          </p>

          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="/studio"
          >
            Crear mi invitación
          </Link>
        </aside>
      </section>
    );
  }

  const failureMessage = portableInvitationFailureMessages[viewState.status];

  return (
    <section
      aria-labelledby="portable-invitation-error-title"
      className="rounded-[2rem] border border-border bg-surface p-8 text-center shadow-soft sm:p-12"
    >
      <p className="text-sm font-bold tracking-[0.16em] text-primary uppercase">
        Enlace no disponible
      </p>

      <h2
        className="mt-3 font-display text-3xl font-semibold text-foreground"
        id="portable-invitation-error-title"
      >
        {failureMessage.title}
      </h2>

      <p className="mx-auto mt-4 max-w-xl leading-7 text-muted">{failureMessage.description}</p>

      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          href="/studio"
        >
          Crear una invitación
        </Link>

        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          href="/"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
