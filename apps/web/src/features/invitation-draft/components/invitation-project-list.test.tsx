import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createInitialInvitationDraft } from '../model/invitation-draft';
import { createInvitationProject } from '../model/invitation-project';
import type { InvitationProject } from '../model/invitation-project';
import { InvitationProjectList } from './invitation-project-list';

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

const firstProject = createProject(
  'project-first',
  'Boda de Andrea y Mateo',
  '2026-09-28T06:00:00.000Z',
);

const secondProject = createProject(
  'project-second',
  'Cena de aniversario',
  '2026-09-28T07:00:00.000Z',
);

const renderProjectList = (projects: readonly InvitationProject[]) => {
  const user = userEvent.setup();
  const handlers = {
    onCreate: vi.fn(),
    onOpen: vi.fn(),
    onDuplicate: vi.fn(),
    onDelete: vi.fn(),
  };

  render(<InvitationProjectList projects={projects} {...handlers} />);

  return {
    user,
    ...handlers,
  };
};

describe('InvitationProjectList', () => {
  it('offers creation from an accessible empty state', async () => {
    const { user, onCreate } = renderProjectList([]);

    expect(
      screen.getByRole('region', {
        name: 'Mis invitaciones',
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('status')).toHaveTextContent('Aún no tienes invitaciones');

    await user.click(
      screen.getByRole('button', {
        name: 'Crear mi primera invitación',
      }),
    );

    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('renders every invitation with its essential information', () => {
    renderProjectList([secondProject, firstProject]);

    const projectList = screen.getByRole('list', {
      name: 'Proyectos de invitación',
    });
    const cards = within(projectList).getAllByRole('article');

    expect(cards).toHaveLength(2);
    expect(
      screen.getByRole('heading', {
        name: 'Cena de aniversario',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Boda de Andrea y Mateo',
      }),
    ).toBeInTheDocument();

    expect(cards[0]).toHaveTextContent('Borrador');
    expect(cards[0]).toHaveTextContent('18 de octubre de 2026');
    expect(cards[0]).toHaveTextContent('Jardín Aurora · Ciudad de México');
    expect(cards[0]).toHaveTextContent('Última modificación');
  });

  it('identifies the project selected by every action', async () => {
    const { user, onOpen, onDuplicate, onDelete } = renderProjectList([firstProject]);

    const card = screen.getByRole('article', {
      name: 'Boda de Andrea y Mateo',
    });

    await user.click(
      within(card).getByRole('button', {
        name: 'Abrir Boda de Andrea y Mateo',
      }),
    );
    await user.click(
      within(card).getByRole('button', {
        name: 'Duplicar Boda de Andrea y Mateo',
      }),
    );
    await user.click(
      within(card).getByRole('button', {
        name: 'Eliminar Boda de Andrea y Mateo',
      }),
    );

    expect(onOpen).toHaveBeenCalledWith('project-first');
    expect(onDuplicate).toHaveBeenCalledWith('project-first');
    expect(onDelete).toHaveBeenCalledWith('project-first');
  });

  it('uses meaningful fallbacks for an incomplete draft', () => {
    const untitledProject = createProject('project-untitled', '', '2026-09-28T08:00:00.000Z');

    const project: InvitationProject = {
      ...untitledProject,
      content: {
        ...untitledProject.content,
        eventDate: '',
        location: '',
      },
    };

    renderProjectList([project]);

    const card = screen.getByRole('article', {
      name: 'Invitación sin título',
    });

    expect(card).toHaveTextContent('Fecha por confirmar');
    expect(card).toHaveTextContent('Lugar por confirmar');
  });
});
