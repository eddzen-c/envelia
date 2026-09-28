'use client';

import { createInvitationPreview, type InvitationDraft } from '../model/invitation-draft';
import { InvitationDraftForm } from './invitation-draft-form';
import { InvitationPreviewCard } from './invitation-preview-card';
import {
  InvitationShareControls,
  type InvitationShareEnvironment,
} from './invitation-share-controls';

type InvitationDraftEditorProps = Readonly<{
  draft: InvitationDraft;
  persistenceMessage: string;
  persistenceUnavailable?: boolean;
  onDraftChange: (draft: InvitationDraft) => void;
  onReset: () => void;
  shareEnvironment?: InvitationShareEnvironment;
}>;

export function InvitationDraftEditor({
  draft,
  persistenceMessage,
  persistenceUnavailable = false,
  onDraftChange,
  onReset,
  shareEnvironment,
}: InvitationDraftEditorProps) {
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
            persistenceUnavailable ? 'bg-amber-500' : 'bg-primary'
          }`}
        />
        {persistenceMessage}
      </div>

      <div className="mt-6">
        <InvitationShareControls
          draft={draft}
          {...(shareEnvironment ? { environment: shareEnvironment } : {})}
        />
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <InvitationDraftForm draft={draft} onDraftChange={onDraftChange} onReset={onReset} />

        <section aria-label="Resultado de la invitación" className="min-w-0 lg:sticky lg:top-6">
          <InvitationPreviewCard preview={preview} />
        </section>
      </div>
    </div>
  );
}
