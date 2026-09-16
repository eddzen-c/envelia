'use client';

import { useEffect, useState } from 'react';

import {
  createInitialInvitationDraft,
  createInvitationPreview,
  type InvitationDraft,
} from '../model/invitation-draft';
import {
  loadInvitationDraft,
  persistInvitationDraft,
  type InvitationDraftStorage,
} from '../model/invitation-draft-persistence';
import { InvitationDraftForm } from './invitation-draft-form';
import { InvitationPreviewCard } from './invitation-preview-card';
import {
  InvitationShareControls,
  type InvitationShareEnvironment,
} from './invitation-share-controls';

type InvitationDraftWorkspaceProps = Readonly<{
  storage?: InvitationDraftStorage;
  shareEnvironment?: InvitationShareEnvironment;
}>;

type PersistenceStatus =
  | 'checking'
  | ReturnType<typeof loadInvitationDraft>['status']
  | ReturnType<typeof persistInvitationDraft>;

const persistenceMessages: Record<PersistenceStatus, string> = {
  checking: 'Comprobando el borrador guardado…',
  empty: 'Los cambios se guardarán en este navegador.',
  restored: 'Borrador recuperado de este navegador.',
  discarded: 'Se descartó un borrador guardado que ya no era válido.',
  saved: 'Borrador guardado en este navegador.',
  cleared: 'Borrador local eliminado; restauramos el ejemplo inicial.',
  unavailable: 'El guardado local no está disponible. Puedes seguir editando durante esta sesión.',
};

const resolveInvitationDraftStorage = (
  storage: InvitationDraftStorage | undefined,
): InvitationDraftStorage | null => {
  if (storage) {
    return storage;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export function InvitationDraftWorkspace({
  storage,
  shareEnvironment,
}: InvitationDraftWorkspaceProps) {
  const [draft, setDraft] = useState<InvitationDraft>(createInitialInvitationDraft);
  const [persistenceStatus, setPersistenceStatus] = useState<PersistenceStatus>('checking');

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      const availableStorage = resolveInvitationDraftStorage(storage);

      if (!availableStorage) {
        setPersistenceStatus('unavailable');
        return;
      }

      const result = loadInvitationDraft(availableStorage);

      if (result.status === 'restored') {
        setDraft(result.draft);
      }

      setPersistenceStatus(result.status);
    });

    return () => {
      isActive = false;
    };
  }, [storage]);

  const updateDraft = (nextDraft: InvitationDraft) => {
    setDraft(nextDraft);

    const availableStorage = resolveInvitationDraftStorage(storage);

    if (!availableStorage) {
      setPersistenceStatus('unavailable');
      return;
    }

    const saveResult = persistInvitationDraft(availableStorage, nextDraft);

    setPersistenceStatus(saveResult);
  };

  const preview = createInvitationPreview(draft);

  return (
    <div>
      <div
        aria-atomic="true"
        aria-label="Estado del borrador"
        className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted"
        role="status"
      >
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${
            persistenceStatus === 'unavailable' ? 'bg-amber-500' : 'bg-primary'
          }`}
        />
        {persistenceMessages[persistenceStatus]}
      </div>

      <div className="mt-6">
        <InvitationShareControls
          draft={draft}
          {...(shareEnvironment ? { environment: shareEnvironment } : {})}
        />
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <InvitationDraftForm
          draft={draft}
          onDraftChange={updateDraft}
          onReset={() => {
            updateDraft(createInitialInvitationDraft());
          }}
        />

        <section aria-label="Resultado de la invitación" className="min-w-0 lg:sticky lg:top-6">
          <InvitationPreviewCard preview={preview} />
        </section>
      </div>
    </div>
  );
}
