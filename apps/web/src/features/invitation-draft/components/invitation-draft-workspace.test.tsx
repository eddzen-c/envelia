import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  createInvitationPreview,
  initialInvitationDraft,
  invitationPreviewFallbacks,
} from '../model/invitation-draft';
import { InvitationDraftWorkspace } from './invitation-draft-workspace';

const renderWorkspace = () => {
  const user = userEvent.setup();

  render(<InvitationDraftWorkspace />);

  const form = screen.getByRole('form', {
    name: 'Diseña tu borrador',
  });
  const result = screen.getByRole('region', {
    name: 'Resultado de la invitación',
  });
  const preview = within(result).getByRole('article', {
    name: 'Vista previa de la invitación',
  });

  return {
    user,
    form,
    preview,
  };
};

describe('InvitationDraftWorkspace', () => {
  it('renders the initial draft in the form and preview', () => {
    const { form, preview } = renderWorkspace();
    const initialPreview = createInvitationPreview(initialInvitationDraft);

    expect(
      within(form).getByRole('textbox', {
        name: /^Título del evento\b/u,
      }),
    ).toHaveValue(initialInvitationDraft.eventTitle);
    expect(within(form).getByLabelText(/^Fecha del evento\b/u)).toHaveValue(
      initialInvitationDraft.eventDate,
    );
    expect(
      within(form).getByRole('textbox', {
        name: /^Lugar\b/u,
      }),
    ).toHaveValue(initialInvitationDraft.location);
    expect(
      within(form).getByRole('textbox', {
        name: /^Mensaje\b/u,
      }),
    ).toHaveValue(initialInvitationDraft.message);

    expect(preview).toHaveTextContent(initialPreview.eventTitle);
    expect(preview).toHaveTextContent(initialPreview.eventDate);
    expect(preview).toHaveTextContent(initialPreview.location);
    expect(preview).toHaveTextContent(initialPreview.message);
  });

  it('updates the preview when the editable fields change', async () => {
    const { user, form, preview } = renderWorkspace();

    const title = within(form).getByRole('textbox', {
      name: /^Título del evento\b/u,
    });
    const date = within(form).getByLabelText(/^Fecha del evento\b/u);
    const location = within(form).getByRole('textbox', {
      name: /^Lugar\b/u,
    });
    const message = within(form).getByRole('textbox', {
      name: /^Mensaje\b/u,
    });

    await user.clear(title);
    await user.type(title, 'Noche de aniversario');
    await user.clear(date);
    await user.type(date, '2027-05-09');
    await user.clear(location);
    await user.type(location, 'Terraza del Lago');
    await user.clear(message);
    await user.type(message, 'Celebremos juntos este momento especial.');

    expect(preview).toHaveTextContent('Noche de aniversario');
    expect(preview).toHaveTextContent('9 de mayo de 2027');
    expect(preview).toHaveTextContent('Terraza del Lago');
    expect(preview).toHaveTextContent('Celebremos juntos este momento especial.');
  });

  it('keeps the preview meaningful when editable fields are empty', async () => {
    const { user, form, preview } = renderWorkspace();

    await user.clear(
      within(form).getByRole('textbox', {
        name: /^Título del evento\b/u,
      }),
    );
    await user.clear(within(form).getByLabelText(/^Fecha del evento\b/u));
    await user.clear(
      within(form).getByRole('textbox', {
        name: /^Lugar\b/u,
      }),
    );
    await user.clear(
      within(form).getByRole('textbox', {
        name: /^Mensaje\b/u,
      }),
    );

    expect(preview).toHaveTextContent(invitationPreviewFallbacks.eventTitle);
    expect(preview).toHaveTextContent(invitationPreviewFallbacks.eventDate);
    expect(preview).toHaveTextContent(invitationPreviewFallbacks.location);
    expect(preview).toHaveTextContent(invitationPreviewFallbacks.message);
  });

  it('applies the selected theme to the preview', async () => {
    const { user, form, preview } = renderWorkspace();
    const midnightTheme = within(form).getByRole('radio', {
      name: /^Medianoche\b/u,
    });

    expect(midnightTheme).toHaveAccessibleDescription(
      /Una composición oscura con acentos luminosos\./u,
    );

    await user.click(midnightTheme);

    expect(midnightTheme).toBeChecked();
    expect(preview).toHaveAttribute('data-theme', 'midnight');
    expect(preview).toHaveTextContent('Medianoche');
  });

  it('restores the complete initial example', async () => {
    const { user, form, preview } = renderWorkspace();

    const title = within(form).getByRole('textbox', {
      name: /^Título del evento\b/u,
    });
    const date = within(form).getByLabelText(/^Fecha del evento\b/u);
    const location = within(form).getByRole('textbox', {
      name: /^Lugar\b/u,
    });
    const message = within(form).getByRole('textbox', {
      name: /^Mensaje\b/u,
    });
    const lavenderTheme = within(form).getByRole('radio', {
      name: /^Lavanda\b/u,
    });
    const midnightTheme = within(form).getByRole('radio', {
      name: /^Medianoche\b/u,
    });

    await user.clear(title);
    await user.type(title, 'Ejemplo temporal');
    await user.clear(date);
    await user.type(date, '2027-12-24');
    await user.clear(location);
    await user.type(location, 'Ubicación temporal');
    await user.clear(message);
    await user.type(message, 'Mensaje temporal');
    await user.click(midnightTheme);
    await user.click(
      within(form).getByRole('button', {
        name: 'Restablecer ejemplo',
      }),
    );

    const initialPreview = createInvitationPreview(initialInvitationDraft);

    expect(title).toHaveValue(initialInvitationDraft.eventTitle);
    expect(date).toHaveValue(initialInvitationDraft.eventDate);
    expect(location).toHaveValue(initialInvitationDraft.location);
    expect(message).toHaveValue(initialInvitationDraft.message);
    expect(lavenderTheme).toBeChecked();
    expect(preview).toHaveAttribute('data-theme', initialInvitationDraft.theme);
    expect(preview).toHaveTextContent(initialPreview.eventTitle);
    expect(preview).toHaveTextContent(initialPreview.eventDate);
    expect(preview).toHaveTextContent(initialPreview.location);
    expect(preview).toHaveTextContent(initialPreview.message);
  });
});
