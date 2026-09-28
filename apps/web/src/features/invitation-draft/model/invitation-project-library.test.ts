import { describe, expect, it } from 'vitest';

import { createInitialInvitationDraft } from './invitation-draft';
import {
  createInvitationProjectInLibrary,
  deleteInvitationProjectFromLibrary,
  duplicateInvitationProjectInLibrary,
  localInvitationProjectOwnerId,
  sortInvitationProjectLibrary,
  updateInvitationProjectInLibrary,
} from './invitation-project-library';
import {
  createInvitationProject,
  publishInvitationProject,
  type InvitationProject,
} from './invitation-project';

const createProject = (
  projectId: string,
  eventTitle: string,
  createdAt: string,
): InvitationProject => {
  const result = createInvitationProject({
    projectId,
    ownerId: localInvitationProjectOwnerId,
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
  'Primera celebración',
  '2026-09-28T06:00:00.000Z',
);

const secondProject = createProject(
  'project-second',
  'Segunda celebración',
  '2026-09-28T07:00:00.000Z',
);

describe('invitation project library operations', () => {
  it('defines one stable owner for browser-local projects', () => {
    expect(localInvitationProjectOwnerId).toBe('local-browser');
  });

  it('sorts projects by their latest update without sharing references', () => {
    const projects = sortInvitationProjectLibrary([firstProject, secondProject]);

    expect(projects.map((project) => project.projectId)).toEqual([
      'project-second',
      'project-first',
    ]);
    expect(projects[1]).not.toBe(firstProject);
    expect(projects[1]?.content).not.toBe(firstProject.content);
  });

  it('creates a draft project and places it first', () => {
    const result = createInvitationProjectInLibrary([firstProject], {
      projectId: 'project-new',
      content: {
        ...createInitialInvitationDraft(),
        eventTitle: 'Nueva celebración',
      },
      occurredAt: '2026-09-28T08:00:00.000Z',
    });

    expect(result.status).toBe('created');

    if (result.status !== 'created') {
      throw new Error('The project should have been created.');
    }

    expect(result.project).toMatchObject({
      projectId: 'project-new',
      ownerId: localInvitationProjectOwnerId,
      status: 'draft',
      createdAt: '2026-09-28T08:00:00.000Z',
      updatedAt: '2026-09-28T08:00:00.000Z',
      publication: null,
      archivedAt: null,
    });
    expect(result.projects.map((project) => project.projectId)).toEqual([
      'project-new',
      'project-first',
    ]);
  });

  it('updates the editable content and modification timestamp', () => {
    const nextContent = {
      ...firstProject.content,
      eventTitle: 'Celebración actualizada',
      theme: 'midnight' as const,
    };

    const result = updateInvitationProjectInLibrary([firstProject], {
      projectId: firstProject.projectId,
      content: nextContent,
      occurredAt: '2026-09-28T09:00:00.000Z',
    });

    expect(result.status).toBe('updated');

    if (result.status !== 'updated') {
      throw new Error('The project should have been updated.');
    }

    expect(result.project.content).toEqual(nextContent);
    expect(result.project.content).not.toBe(nextContent);
    expect(result.project.updatedAt).toBe('2026-09-28T09:00:00.000Z');
    expect(firstProject.content.eventTitle).toBe('Primera celebración');
  });

  it('duplicates only the editable content into a new draft', () => {
    const result = duplicateInvitationProjectInLibrary([firstProject], {
      sourceProjectId: firstProject.projectId,
      projectId: 'project-copy',
      occurredAt: '2026-09-28T10:00:00.000Z',
    });

    expect(result.status).toBe('duplicated');

    if (result.status !== 'duplicated') {
      throw new Error('The project should have been duplicated.');
    }

    expect(result.project).toMatchObject({
      projectId: 'project-copy',
      status: 'draft',
      content: firstProject.content,
      createdAt: '2026-09-28T10:00:00.000Z',
      updatedAt: '2026-09-28T10:00:00.000Z',
      publication: null,
      archivedAt: null,
    });
    expect(result.project.content).not.toBe(firstProject.content);
  });

  it('deletes only the selected project', () => {
    const result = deleteInvitationProjectFromLibrary(
      [firstProject, secondProject],
      firstProject.projectId,
    );

    expect(result.status).toBe('deleted');

    if (result.status !== 'deleted') {
      throw new Error('The project should have been deleted.');
    }

    expect(result.project).toEqual(firstProject);
    expect(result.projects).toEqual([secondProject]);
  });

  it('rejects duplicated identifiers during creation and duplication', () => {
    expect(
      createInvitationProjectInLibrary([firstProject], {
        projectId: firstProject.projectId,
        content: createInitialInvitationDraft(),
        occurredAt: '2026-09-28T08:00:00.000Z',
      }),
    ).toMatchObject({
      status: 'rejected',
      reason: 'duplicate-id',
    });

    expect(
      duplicateInvitationProjectInLibrary([firstProject, secondProject], {
        sourceProjectId: firstProject.projectId,
        projectId: secondProject.projectId,
        occurredAt: '2026-09-28T08:00:00.000Z',
      }),
    ).toMatchObject({
      status: 'rejected',
      reason: 'duplicate-id',
    });
  });

  it('rejects operations for projects that do not exist', () => {
    expect(
      updateInvitationProjectInLibrary([firstProject], {
        projectId: 'missing-project',
        content: createInitialInvitationDraft(),
        occurredAt: '2026-09-28T08:00:00.000Z',
      }),
    ).toMatchObject({
      status: 'rejected',
      reason: 'not-found',
    });

    expect(
      duplicateInvitationProjectInLibrary([firstProject], {
        sourceProjectId: 'missing-project',
        projectId: 'project-copy',
        occurredAt: '2026-09-28T08:00:00.000Z',
      }),
    ).toMatchObject({
      status: 'rejected',
      reason: 'not-found',
    });

    expect(deleteInvitationProjectFromLibrary([firstProject], 'missing-project')).toMatchObject({
      status: 'rejected',
      reason: 'not-found',
    });
  });

  it('rejects stale updates without changing the project', () => {
    expect(
      updateInvitationProjectInLibrary([secondProject], {
        projectId: secondProject.projectId,
        content: createInitialInvitationDraft(),
        occurredAt: '2026-09-28T06:59:59.999Z',
      }),
    ).toMatchObject({
      status: 'rejected',
      reason: 'stale-timestamp',
    });
  });

  it('does not edit a project that is already published', () => {
    const publicationResult = publishInvitationProject(firstProject, {
      publicationId: 'publication-first',
      occurredAt: '2026-09-28T08:00:00.000Z',
    });

    if (publicationResult.status !== 'transitioned') {
      throw new Error('The project should have been published.');
    }

    expect(
      updateInvitationProjectInLibrary([publicationResult.project], {
        projectId: publicationResult.project.projectId,
        content: createInitialInvitationDraft(),
        occurredAt: '2026-09-28T09:00:00.000Z',
      }),
    ).toMatchObject({
      status: 'rejected',
      reason: 'not-editable',
    });
  });

  it('rejects malformed operation input', () => {
    expect(
      createInvitationProjectInLibrary([firstProject], {
        projectId: 'invalid project id',
        content: createInitialInvitationDraft(),
        occurredAt: '2026-09-28T08:00:00.000Z',
      }),
    ).toMatchObject({
      status: 'rejected',
      reason: 'invalid-input',
    });

    expect(
      updateInvitationProjectInLibrary([firstProject], {
        projectId: firstProject.projectId,
        content: {
          ...createInitialInvitationDraft(),
          eventTitle: 'x'.repeat(81),
        },
        occurredAt: '2026-09-28T08:00:00.000Z',
      }),
    ).toMatchObject({
      status: 'rejected',
      reason: 'invalid-input',
    });

    expect(deleteInvitationProjectFromLibrary([firstProject], '')).toMatchObject({
      status: 'rejected',
      reason: 'invalid-input',
    });
  });

  it('rejects a malformed or duplicated starting library', () => {
    const invalidProject = {
      ...firstProject,
      ownerId: 'invalid owner',
    } as unknown as InvitationProject;

    expect(
      createInvitationProjectInLibrary([invalidProject], {
        projectId: 'project-new',
        content: createInitialInvitationDraft(),
        occurredAt: '2026-09-28T08:00:00.000Z',
      }),
    ).toMatchObject({
      status: 'rejected',
      reason: 'invalid-library',
    });

    expect(
      deleteInvitationProjectFromLibrary([firstProject, firstProject], firstProject.projectId),
    ).toMatchObject({
      status: 'rejected',
      reason: 'invalid-library',
    });
  });
});
