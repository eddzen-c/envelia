'use client';

import { useId, useState } from 'react';

import type { InvitationDraft } from '../model/invitation-draft';
import {
  encodePortableInvitationDraft,
  portableInvitationPath,
} from '../model/invitation-draft-portable-link';

export type InvitationShareData = Readonly<{
  title: string;
  text: string;
  url: string;
}>;

export type InvitationShareEnvironment = Readonly<{
  origin: string;
  share?: (data: InvitationShareData) => Promise<void>;
  writeText?: (value: string) => Promise<void>;
}>;

type InvitationShareControlsProps = Readonly<{
  draft: InvitationDraft;
  environment?: InvitationShareEnvironment;
}>;

type InvitationShareStatus =
  | 'idle'
  | 'working'
  | 'shared'
  | 'copied'
  | 'cancelled'
  | 'unavailable'
  | 'failed'
  | 'invalid-draft'
  | 'too-large';

type PortableInvitationUrlResult =
  | Readonly<{
      status: 'created';
      url: string;
    }>
  | Readonly<{
      status: 'invalid-draft' | 'too-large' | 'invalid-origin';
      url: null;
    }>;

const invitationShareMessages: Record<InvitationShareStatus, string> = {
  idle: 'El enlace incluirá una copia portable del borrador actual.',
  working: 'Preparando el enlace compartible…',
  shared: 'Invitación compartida correctamente.',
  copied: 'Enlace copiado al portapapeles.',
  cancelled: 'No se compartió la invitación.',
  unavailable: 'Las opciones para compartir no están disponibles en este navegador.',
  failed: 'No pudimos compartir ni copiar el enlace. Inténtalo nuevamente.',
  'invalid-draft': 'El borrador actual no puede convertirse en un enlace.',
  'too-large': 'El borrador supera el tamaño permitido para un enlace portable.',
};

const isAbortError = (error: unknown) => error instanceof Error && error.name === 'AbortError';

const resolveBrowserShareEnvironment = (): InvitationShareEnvironment | null => {
  try {
    const clipboard = navigator.clipboard;

    const share =
      typeof navigator.share === 'function'
        ? (data: InvitationShareData) => navigator.share(data)
        : undefined;

    const writeText =
      typeof clipboard?.writeText === 'function'
        ? (value: string) => clipboard.writeText(value)
        : undefined;

    return {
      origin: window.location.origin,
      ...(share ? { share } : {}),
      ...(writeText ? { writeText } : {}),
    };
  } catch {
    return null;
  }
};

const createPortableInvitationUrl = (
  origin: string,
  draft: InvitationDraft,
): PortableInvitationUrlResult => {
  const encodeResult = encodePortableInvitationDraft(draft);

  if (encodeResult.status !== 'encoded') {
    return {
      status: encodeResult.status,
      url: null,
    };
  }

  try {
    const invitationUrl = new URL(portableInvitationPath, origin);

    if (invitationUrl.protocol !== 'http:' && invitationUrl.protocol !== 'https:') {
      return {
        status: 'invalid-origin',
        url: null,
      };
    }

    invitationUrl.hash = encodeResult.payload;

    return {
      status: 'created',
      url: invitationUrl.toString(),
    };
  } catch {
    return {
      status: 'invalid-origin',
      url: null,
    };
  }
};

export function InvitationShareControls({ draft, environment }: InvitationShareControlsProps) {
  const accessibleId = useId();
  const titleId = `${accessibleId}-title`;
  const descriptionId = `${accessibleId}-description`;
  const statusId = `${accessibleId}-status`;
  const [shareStatus, setShareStatus] = useState<InvitationShareStatus>('idle');

  const shareInvitation = async () => {
    setShareStatus('working');

    const availableEnvironment = environment ?? resolveBrowserShareEnvironment();

    if (!availableEnvironment) {
      setShareStatus('unavailable');
      return;
    }

    const urlResult = createPortableInvitationUrl(availableEnvironment.origin, draft);

    if (urlResult.status === 'invalid-origin') {
      setShareStatus('unavailable');
      return;
    }

    if (urlResult.status !== 'created') {
      setShareStatus(urlResult.status);
      return;
    }

    const shareData: InvitationShareData = {
      title: draft.eventTitle.trim() || 'Invitación de Envelia Studio',
      text: 'Has recibido una invitación creada con Envelia Studio.',
      url: urlResult.url,
    };

    let nativeShareFailed = false;

    if (availableEnvironment.share) {
      try {
        await availableEnvironment.share(shareData);
        setShareStatus('shared');
        return;
      } catch (error) {
        if (isAbortError(error)) {
          setShareStatus('cancelled');
          return;
        }

        nativeShareFailed = true;
      }
    }

    if (availableEnvironment.writeText) {
      try {
        await availableEnvironment.writeText(urlResult.url);
        setShareStatus('copied');
        return;
      } catch {
        setShareStatus('failed');
        return;
      }
    }

    setShareStatus(nativeShareFailed ? 'failed' : 'unavailable');
  };

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
            Comparte tu diseño
          </p>

          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground" id={titleId}>
            Envía esta invitación con un enlace
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted" id={descriptionId}>
            El enlace contiene una copia del borrador actual y no publica información en un
            servidor.
          </p>
        </div>

        <button
          aria-describedby={`${descriptionId} ${statusId}`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
          disabled={shareStatus === 'working'}
          onClick={() => {
            void shareInvitation();
          }}
          type="button"
        >
          {shareStatus === 'working' ? 'Preparando enlace…' : 'Compartir invitación'}
        </button>
      </div>

      <p
        aria-atomic="true"
        aria-label="Estado del enlace compartible"
        className="mt-4 text-sm font-semibold text-muted"
        id={statusId}
        role="status"
      >
        {invitationShareMessages[shareStatus]}
      </p>
    </section>
  );
}
