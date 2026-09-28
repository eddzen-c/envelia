import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { createInitialInvitationDraft, type InvitationDraft } from '../model/invitation-draft';
import { InvitationDraftEditor } from './invitation-draft-editor';

const initialControlledDraft: InvitationDraft = {
  ...createInitialInvitationDraft(),
  eventTitle: 'Proyecto controlado',
  eventDate: '2027-08-14',
  location: 'Salón Magnolia',
  message: 'Acompáñanos a celebrar.',
  theme: 'champagne',
};

function ControlledEditorHarness() {
  const [draft, setDraft] = useState<InvitationDraft>(initialControlledDraft);

  return (
    <InvitationDraftEditor
      draft={draft}
      onDraftChange={setDraft}
      onReset={() => {
        setDraft(createInitialInvitationDraft());
      }}
      persistenceMessage="Proyecto guardado en este navegador."
    />
  );
}

describe('InvitationDraftEditor', () => {
  it('edits and resets a draft supplied by its parent', async () => {
    const user = userEvent.setup();

    render(<ControlledEditorHarness />);

    const form = screen.getByRole('form', {
      name: 'Diseña tu borrador',
    });
    const result = screen.getByRole('region', {
      name: 'Resultado de la invitación',
    });
    const preview = within(result).getByRole('article', {
      name: 'Vista previa de la invitación',
    });
    const title = within(form).getByRole('textbox', {
      name: /^Título del evento\b/u,
    });

    expect(title).toHaveValue('Proyecto controlado');
    expect(preview).toHaveTextContent('Proyecto controlado');
    expect(
      screen.getByRole('status', {
        name: 'Estado del borrador',
      }),
    ).toHaveTextContent('Proyecto guardado en este navegador.');

    await user.clear(title);
    await user.type(title, 'Proyecto actualizado');

    expect(title).toHaveValue('Proyecto actualizado');
    expect(preview).toHaveTextContent('Proyecto actualizado');

    await user.click(
      within(form).getByRole('button', {
        name: 'Restablecer ejemplo',
      }),
    );

    expect(title).toHaveValue(createInitialInvitationDraft().eventTitle);
    expect(preview).toHaveTextContent(createInitialInvitationDraft().eventTitle);
  });
});
