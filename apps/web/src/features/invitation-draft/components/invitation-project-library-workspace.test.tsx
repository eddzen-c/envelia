import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createInitialInvitationDraft, type InvitationDraft } from '../model/invitation-draft';
import {
  invitationDraftStorageKey,
  serializeInvitationDraft,
} from '../model/invitation-draft-persistence';
import {
  invitationProjectLibraryStorageKey,
  parseInvitationProjectLibrary,
  serializeInvitationProjectLibrary,
  type InvitationProjectLibraryStorage,
} from '../model/invitation-project-library-persistence';
import { createInvitationProject, type InvitationProject } from '../model/invitation-project';
import { InvitationProjectLibraryWorkspace } from './invitation-project-library-workspace';

const createProject = (
  projectId: string,
  eventTitle: string,
  createdAt: string,
): InvitationProject => {
  const result = createInvitationProject({
    projectId,
    ownerId: 'local-browser',
    content: {
      ...createInitialInvitationDraft(),
      eventTitle,
    },
    createdAt,
  });

  if (result.status !== 'created') {
    throw new Error('The test project must be valid.');
  }

  return result.project;
};

const createStorage = (initialValues: Readonly<Record<string, string>> = {}) => {
  const values = new Map(Object.entries(initialValues));

  const storage: InvitationProjectLibraryStorage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    }),
  };

  return {
    storage,
    read: (key: string) => values.get(key) ?? null,
  };
};

const renderWorkspace = (
  storage: InvitationProjectLibraryStorage,
  options: Readonly<{
    createProjectId?: () => string;
    getCurrentTimestamp?: () => string;
    confirmDelete?: (project: InvitationProject) => boolean;
  }> = {},
) => {
  const user = userEvent.setup();

  render(<InvitationProjectLibraryWorkspace storage={storage} {...options} />);

  return { user };
};

const storedProject = createProject(
  'project-stored',
  'Graduación de Valeria',
  '2026-09-28T14:00:00.000Z',
);

describe('InvitationProjectLibraryWorkspace', () => {
  it('creates, edits, persists, and reopens a local project', async () => {
    const memory = createStorage();
    const { user } = renderWorkspace(memory.storage, {
      createProjectId: () => 'project-new',
      getCurrentTimestamp: () => '2026-09-28T15:00:00.000Z',
    });

    await screen.findByRole('heading', {
      name: 'Mis invitaciones',
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Crear mi primera invitación',
      }),
    );

    const form = await screen.findByRole('form', {
      name: 'Diseña tu borrador',
    });
    const title = within(form).getByRole('textbox', {
      name: /^Título del evento\b/u,
    });

    await user.clear(title);
    await user.type(title, 'Cumpleaños de Elena');

    expect(title).toHaveValue('Cumpleaños de Elena');

    await user.click(
      screen.getByRole('button', {
        name: 'Volver a Mis invitaciones',
      }),
    );

    expect(
      await screen.findByRole('heading', {
        name: 'Cumpleaños de Elena',
      }),
    ).toBeInTheDocument();

    const serializedLibrary = memory.read(invitationProjectLibraryStorageKey);

    if (!serializedLibrary) {
      throw new Error('The project library should be persisted.');
    }

    const projects = parseInvitationProjectLibrary(serializedLibrary);

    expect(projects).toHaveLength(1);
    expect(projects?.[0]?.content.eventTitle).toBe('Cumpleaños de Elena');
  });

  it('restores and opens a previously saved project', async () => {
    const memory = createStorage({
      [invitationProjectLibraryStorageKey]: serializeInvitationProjectLibrary([storedProject]),
    });
    const { user } = renderWorkspace(memory.storage);

    const projectHeading = await screen.findByRole('heading', {
      name: 'Graduación de Valeria',
    });

    expect(projectHeading).toBeInTheDocument();
    expect(
      screen.getByRole('status', {
        name: 'Estado de la biblioteca',
      }),
    ).toHaveTextContent('Invitaciones recuperadas de este navegador.');

    await user.click(
      screen.getByRole('button', {
        name: 'Abrir Graduación de Valeria',
      }),
    );

    const form = await screen.findByRole('form', {
      name: 'Diseña tu borrador',
    });

    expect(
      within(form).getByRole('textbox', {
        name: /^Título del evento\b/u,
      }),
    ).toHaveValue('Graduación de Valeria');
  });

  it('duplicates and deletes projects after confirmation', async () => {
    const memory = createStorage({
      [invitationProjectLibraryStorageKey]: serializeInvitationProjectLibrary([storedProject]),
    });
    const confirmDelete = vi.fn(() => true);
    const { user } = renderWorkspace(memory.storage, {
      createProjectId: () => 'project-copy',
      getCurrentTimestamp: () => '2026-09-28T16:00:00.000Z',
      confirmDelete,
    });

    await screen.findByRole('heading', {
      name: 'Graduación de Valeria',
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Duplicar Graduación de Valeria',
      }),
    );

    expect(
      screen.getAllByRole('heading', {
        name: 'Graduación de Valeria',
      }),
    ).toHaveLength(2);

    const deleteButtons = screen.getAllByRole('button', {
      name: 'Eliminar Graduación de Valeria',
    });

    const deleteButton = deleteButtons[0];

    if (!deleteButton) {
      throw new Error('A delete button should be available.');
    }

    await user.click(deleteButton);

    expect(confirmDelete).toHaveBeenCalledTimes(1);
    expect(
      screen.getAllByRole('heading', {
        name: 'Graduación de Valeria',
      }),
    ).toHaveLength(1);

    const serializedLibrary = memory.read(invitationProjectLibraryStorageKey);

    if (!serializedLibrary) {
      throw new Error('The remaining project should be persisted.');
    }

    expect(parseInvitationProjectLibrary(serializedLibrary)).toHaveLength(1);
  });

  it('migrates the previous single draft without losing it', async () => {
    const legacyDraft: InvitationDraft = {
      ...createInitialInvitationDraft(),
      eventTitle: 'Borrador anterior',
      theme: 'midnight',
    };
    const memory = createStorage({
      [invitationDraftStorageKey]: serializeInvitationDraft(legacyDraft),
    });

    renderWorkspace(memory.storage, {
      createProjectId: () => 'project-migrated',
      getCurrentTimestamp: () => '2026-09-28T17:00:00.000Z',
    });

    expect(
      await screen.findByRole('heading', {
        name: 'Borrador anterior',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('status', {
        name: 'Estado de la biblioteca',
      }),
    ).toHaveTextContent('Tu borrador anterior se agregó a Mis invitaciones.');

    expect(memory.read(invitationDraftStorageKey)).toBeNull();

    const serializedLibrary = memory.read(invitationProjectLibraryStorageKey);

    if (!serializedLibrary) {
      throw new Error('The migrated library should be persisted.');
    }

    expect(parseInvitationProjectLibrary(serializedLibrary)?.[0]).toMatchObject({
      projectId: 'project-migrated',
      content: legacyDraft,
    });
  });

  it('remains usable for the current session when storage fails', async () => {
    const unavailableStorage: InvitationProjectLibraryStorage = {
      getItem: () => {
        throw new Error('Storage access denied');
      },
      setItem: () => {
        throw new Error('Storage access denied');
      },
      removeItem: () => {
        throw new Error('Storage access denied');
      },
    };
    const { user } = renderWorkspace(unavailableStorage, {
      createProjectId: () => 'project-session',
      getCurrentTimestamp: () => '2026-09-28T18:00:00.000Z',
    });

    await waitFor(() => {
      expect(
        screen.getByRole('status', {
          name: 'Estado de la biblioteca',
        }),
      ).toHaveTextContent('El guardado local no está disponible.');
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Nueva invitación',
      }),
    );

    const form = await screen.findByRole('form', {
      name: 'Diseña tu borrador',
    });
    const title = within(form).getByRole('textbox', {
      name: /^Título del evento\b/u,
    });

    await user.clear(title);
    await user.type(title, 'Invitación de esta sesión');

    expect(title).toHaveValue('Invitación de esta sesión');
    expect(
      screen.getByRole('status', {
        name: 'Estado del borrador',
      }),
    ).toHaveTextContent('El guardado local no está disponible.');
  });
});
