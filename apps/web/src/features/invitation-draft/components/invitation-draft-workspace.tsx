'use client';

import { useState } from 'react';

import {
  createInitialInvitationDraft,
  createInvitationPreview,
  type InvitationDraft,
} from '../model/invitation-draft';
import { InvitationDraftForm } from './invitation-draft-form';
import { InvitationPreviewCard } from './invitation-preview-card';

export function InvitationDraftWorkspace() {
  const [draft, setDraft] = useState<InvitationDraft>(createInitialInvitationDraft);

  const preview = createInvitationPreview(draft);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
      <InvitationDraftForm
        draft={draft}
        onDraftChange={setDraft}
        onReset={() => {
          setDraft(createInitialInvitationDraft());
        }}
      />

      <section aria-label="Resultado de la invitación" className="min-w-0 lg:sticky lg:top-6">
        <InvitationPreviewCard preview={preview} />
      </section>
    </div>
  );
}
