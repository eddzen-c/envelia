import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  createInvitationPreview,
  initialInvitationDraft,
  invitationPreviewFallbacks,
  type InvitationDraft,
} from '../model/invitation-draft';
import {
  invitationDraftStorageKey,
  serializeInvitationDraft,
  type InvitationDraftStorage,
} from '../model/invitation-draft-persistence';
import { InvitationDraftWorkspace } from './invitation-draft-workspace';

const createStorage = (initialValue: string | null = null) => {
  let storedValue = initialValue;

  return {
    getItem: vi.fn((key: string) => (key === invitationDraftStorageKey ? storedValue : null)),
    setItem: vi.fn((key: string, value: string) => {
      if (key === invitationDraftStorageKey) {
        storedValue = value;
      }
    }),
    removeItem: vi.fn((key: string) => {
      if (key === invitationDraftStorageKey) {
        storedValue = null;
      }
    }),
  } satisfies InvitationDraftStorage;
};

const renderWorkspace = (storage: InvitationDraftStorage = createStorage()) => {
  const user = userEvent.setup();

  render(<InvitationDraftWorkspace storage={storage} />);

  const form = screen.getByRole('form', {
    name: 'Diseña tu borrador',
  });
  const result = screen.getByRole('region', {
    name: 'Resultado de la invitación',
  });
  const preview = within(result).getByRole('article', {
    name: 'Vista previa de la invitación',
  });
  const persistenceStatus = screen.getByRole('status', {
    name: 'Estado del borrador',
  });

  return {
    user,
    form,
    preview,
    persistenceStatus,
  };
};

const waitForEmptyStorage = async (persistenceStatus: HTMLElement) => {
  await waitFor(() => {
    expect(persistenceStatus).toHaveTextContent('Los cambios se guardarán en este navegador.');
  });
};

describe('InvitationDraftWorkspace', () => {
  it('renders the initial draft without persisting the unchanged example', async () => {
    const storage = createStorage();
    const { form, preview, persistenceStatus } = renderWorkspace(storage);
    const initialPreview = createInvitationPreview(initialInvitationDraft);

    await waitForEmptyStorage(persistenceStatus);

    expect(storage.getItem).toHaveBeenCalledWith(invitationDraftStorageKey);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(storage.removeItem).not.toHaveBeenCalled();

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

  it('updates the preview and persists every editable field', async () => {
    const storage = createStorage();
    const { user, form, preview, persistenceStatus } = renderWorkspace(storage);

    await waitForEmptyStorage(persistenceStatus);

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

    const expectedDraft: InvitationDraft = {
      eventTitle: 'Noche de aniversario',
      eventDate: '2027-05-09',
      location: 'Terraza del Lago',
      message: 'Celebremos juntos este momento especial.',
      theme: initialInvitationDraft.theme,
    };

    expect(preview).toHaveTextContent('Noche de aniversario');
    expect(preview).toHaveTextContent('9 de mayo de 2027');
    expect(preview).toHaveTextContent('Terraza del Lago');
    expect(preview).toHaveTextContent('Celebremos juntos este momento especial.');
    expect(persistenceStatus).toHaveTextContent('Borrador guardado en este navegador.');
    expect(storage.setItem).toHaveBeenLastCalledWith(
      invitationDraftStorageKey,
      serializeInvitationDraft(expectedDraft),
    );
  });

  it('keeps the preview meaningful when persisted fields are empty', async () => {
    const storage = createStorage();
    const { user, form, preview, persistenceStatus } = renderWorkspace(storage);

    await waitForEmptyStorage(persistenceStatus);

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
    expect(persistenceStatus).toHaveTextContent('Borrador guardado en este navegador.');
    expect(storage.setItem).toHaveBeenCalled();
  });

  it('applies and persists the selected theme', async () => {
    const storage = createStorage();
    const { user, form, preview, persistenceStatus } = renderWorkspace(storage);

    await waitForEmptyStorage(persistenceStatus);

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
    expect(storage.setItem).toHaveBeenLastCalledWith(
      invitationDraftStorageKey,
      serializeInvitationDraft({
        ...initialInvitationDraft,
        theme: 'midnight',
      }),
    );
  });

  it('restores a valid draft after client hydration', async () => {
    const restoredDraft: InvitationDraft = {
      eventTitle: 'Graduación de Valeria',
      eventDate: '2027-06-25',
      location: 'Jardín de los Arcos',
      message: 'Celebremos juntos el comienzo de una nueva etapa.',
      theme: 'champagne',
    };
    const storage = createStorage(serializeInvitationDraft(restoredDraft));
    const { form, preview, persistenceStatus } = renderWorkspace(storage);

    await waitFor(() => {
      expect(
        within(form).getByRole('textbox', {
          name: /^Título del evento\b/u,
        }),
      ).toHaveValue(restoredDraft.eventTitle);
    });

    expect(persistenceStatus).toHaveTextContent('Borrador recuperado de este navegador.');
    expect(within(form).getByLabelText(/^Fecha del evento\b/u)).toHaveValue(
      restoredDraft.eventDate,
    );
    expect(
      within(form).getByRole('textbox', {
        name: /^Lugar\b/u,
      }),
    ).toHaveValue(restoredDraft.location);
    expect(
      within(form).getByRole('textbox', {
        name: /^Mensaje\b/u,
      }),
    ).toHaveValue(restoredDraft.message);
    expect(
      within(form).getByRole('radio', {
        name: /^Champaña\b/u,
      }),
    ).toBeChecked();
    expect(preview).toHaveTextContent(restoredDraft.eventTitle);
    expect(preview).toHaveTextContent('25 de junio de 2027');
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('clears the persisted draft when restoring the initial example', async () => {
    const restoredDraft: InvitationDraft = {
      eventTitle: 'Celebración temporal',
      eventDate: '2027-12-24',
      location: 'Ubicación temporal',
      message: 'Mensaje temporal',
      theme: 'midnight',
    };
    const storage = createStorage(serializeInvitationDraft(restoredDraft));
    const { user, form, preview, persistenceStatus } = renderWorkspace(storage);

    const title = within(form).getByRole('textbox', {
      name: /^Título del evento\b/u,
    });

    await waitFor(() => {
      expect(title).toHaveValue(restoredDraft.eventTitle);
    });

    await user.click(
      within(form).getByRole('button', {
        name: 'Restablecer ejemplo',
      }),
    );

    const initialPreview = createInvitationPreview(initialInvitationDraft);

    expect(title).toHaveValue(initialInvitationDraft.eventTitle);
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
    expect(
      within(form).getByRole('radio', {
        name: /^Lavanda\b/u,
      }),
    ).toBeChecked();
    expect(preview).toHaveAttribute('data-theme', initialInvitationDraft.theme);
    expect(preview).toHaveTextContent(initialPreview.eventTitle);
    expect(storage.removeItem).toHaveBeenLastCalledWith(invitationDraftStorageKey);
    expect(persistenceStatus).toHaveTextContent(
      'Borrador local eliminado; restauramos el ejemplo inicial.',
    );
  });

  it('discards invalid stored data and keeps the initial example', async () => {
    const storage = createStorage('{not-valid-json');
    const { form, persistenceStatus } = renderWorkspace(storage);

    await waitFor(() => {
      expect(persistenceStatus).toHaveTextContent(
        'Se descartó un borrador guardado que ya no era válido.',
      );
    });

    expect(storage.removeItem).toHaveBeenCalledWith(invitationDraftStorageKey);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(
      within(form).getByRole('textbox', {
        name: /^Título del evento\b/u,
      }),
    ).toHaveValue(initialInvitationDraft.eventTitle);
  });

  it('remains usable when reading storage fails', async () => {
    const storage = createStorage();

    storage.getItem.mockImplementation(() => {
      throw new Error('Storage access denied');
    });

    const { form, preview, persistenceStatus } = renderWorkspace(storage);

    await waitFor(() => {
      expect(persistenceStatus).toHaveTextContent('El guardado local no está disponible.');
    });

    expect(
      within(form).getByRole('textbox', {
        name: /^Título del evento\b/u,
      }),
    ).toHaveValue(initialInvitationDraft.eventTitle);
    expect(preview).toHaveTextContent(initialInvitationDraft.eventTitle);
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  it('keeps editing available when writing storage fails', async () => {
    const storage = createStorage();

    storage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const { user, form, preview, persistenceStatus } = renderWorkspace(storage);

    await waitForEmptyStorage(persistenceStatus);

    const title = within(form).getByRole('textbox', {
      name: /^Título del evento\b/u,
    });

    await user.clear(title);
    await user.type(title, 'Evento durante esta sesión');

    expect(title).toHaveValue('Evento durante esta sesión');
    expect(preview).toHaveTextContent('Evento durante esta sesión');
    expect(persistenceStatus).toHaveTextContent('El guardado local no está disponible.');
    expect(storage.setItem).toHaveBeenCalled();
  });
});
