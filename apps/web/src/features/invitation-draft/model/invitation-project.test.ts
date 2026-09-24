import { describe, expect, expectTypeOf, it } from 'vitest';

import { initialInvitationDraft, type InvitationDraft } from './invitation-draft';
import {
  archiveInvitationProject,
  cloneInvitationProject,
  createInvitationProject,
  invitationProjectIdentityMaxLength,
  invitationProjectStatuses,
  invitationProjectTransitions,
  isInvitationProject,
  isInvitationProjectPublication,
  isInvitationProjectStatus,
  publishInvitationProject,
  restoreInvitationProject,
  unpublishInvitationProject,
  type CreateInvitationProjectInput,
  type InvitationOwnerId,
  type InvitationProject,
  type InvitationProjectId,
  type InvitationProjectTransitionInput,
  type InvitationPublicationId,
  type PublishInvitationProjectInput,
} from './invitation-project';

const createdAt = '2026-09-22T05:00:00.000Z';
const publishedAt = '2026-09-22T06:00:00.000Z';
const archivedAt = '2026-09-22T07:00:00.000Z';

const createValidInput = (): CreateInvitationProjectInput => ({
  projectId: 'project_123',
  ownerId: 'owner_456',
  content: {
    ...initialInvitationDraft,
  },
  createdAt,
});

const createDraftProject = () => {
  const result = createInvitationProject(createValidInput());

  if (result.status !== 'created') {
    throw new Error('Expected the project fixture to be created');
  }

  return result.project;
};

describe('invitation project domain model', () => {
  it('defines stable lifecycle statuses and an explicit identity boundary', () => {
    expect(invitationProjectStatuses).toEqual(['draft', 'published', 'archived']);
    expect(invitationProjectIdentityMaxLength).toBe(128);

    expect(isInvitationProjectStatus('draft')).toBe(true);
    expect(isInvitationProjectStatus('published')).toBe(true);
    expect(isInvitationProjectStatus('archived')).toBe(true);
    expect(isInvitationProjectStatus('deleted')).toBe(false);

    expectTypeOf<InvitationProjectId>().not.toEqualTypeOf<InvitationOwnerId>();
    expectTypeOf<InvitationProjectId>().not.toEqualTypeOf<InvitationPublicationId>();
    expectTypeOf<InvitationOwnerId>().not.toEqualTypeOf<InvitationPublicationId>();
  });

  it('creates a valid draft project with independent invitation content', () => {
    const input = createValidInput();
    const result = createInvitationProject(input);

    expect(result).toEqual({
      status: 'created',
      project: {
        projectId: input.projectId,
        ownerId: input.ownerId,
        content: input.content,
        status: 'draft',
        createdAt,
        updatedAt: createdAt,
        publication: null,
        archivedAt: null,
      },
    });

    if (result.status !== 'created') {
      throw new Error('Expected a created project');
    }

    expect(result.project.content).not.toBe(input.content);
    expect(isInvitationProject(result.project)).toBe(true);
  });

  it('rejects invalid, partial, and extended creation inputs', () => {
    expect(
      createInvitationProject({
        ...createValidInput(),
        projectId: 'invalid project',
      }),
    ).toEqual({
      status: 'invalid',
      project: null,
    });

    expect(
      createInvitationProject({
        projectId: 'project_123',
      } as CreateInvitationProjectInput),
    ).toEqual({
      status: 'invalid',
      project: null,
    });

    expect(
      createInvitationProject({
        ...createValidInput(),
        unexpected: true,
      } as CreateInvitationProjectInput),
    ).toEqual({
      status: 'invalid',
      project: null,
    });
  });

  it('accepts coherent draft, published, and archived projects', () => {
    const draftProject = createDraftProject();

    const publishedProject: InvitationProject = {
      ...draftProject,
      status: 'published',
      updatedAt: publishedAt,
      publication: {
        publicationId: 'publication_789' as InvitationPublicationId,
        publishedAt,
      },
      archivedAt: null,
    };

    const archivedDraftProject: InvitationProject = {
      ...draftProject,
      status: 'archived',
      updatedAt: archivedAt,
      publication: null,
      archivedAt,
    };

    const archivedPublishedProject: InvitationProject = {
      ...publishedProject,
      status: 'archived',
      updatedAt: archivedAt,
      archivedAt,
    };

    expect(isInvitationProject(draftProject)).toBe(true);
    expect(isInvitationProject(publishedProject)).toBe(true);
    expect(isInvitationProject(archivedDraftProject)).toBe(true);
    expect(isInvitationProject(archivedPublishedProject)).toBe(true);

    expect(
      isInvitationProjectPublication({
        publicationId: 'publication_789' as InvitationPublicationId,
        publishedAt,
      }),
    ).toBe(true);
  });

  it('rejects partial projects and unexpected project fields', () => {
    const draftProject = createDraftProject();

    const partialProject = {
      projectId: draftProject.projectId,
      content: draftProject.content,
      status: draftProject.status,
      createdAt: draftProject.createdAt,
      updatedAt: draftProject.updatedAt,
      publication: draftProject.publication,
      archivedAt: draftProject.archivedAt,
    };

    expect(isInvitationProject(partialProject)).toBe(false);

    expect(
      isInvitationProject({
        ...draftProject,
        unexpected: true,
      }),
    ).toBe(false);
  });

  it('rejects invalid identities, timestamps, and chronological order', () => {
    const draftProject = createDraftProject();

    expect(
      isInvitationProject({
        ...draftProject,
        ownerId: '',
      }),
    ).toBe(false);

    expect(
      isInvitationProject({
        ...draftProject,
        projectId: 'a'.repeat(invitationProjectIdentityMaxLength + 1),
      }),
    ).toBe(false);

    expect(
      isInvitationProject({
        ...draftProject,
        updatedAt: '2026-09-22',
      }),
    ).toBe(false);

    expect(
      isInvitationProject({
        ...draftProject,
        updatedAt: '2026-09-22T04:59:59.999Z',
      }),
    ).toBe(false);
  });

  it('rejects lifecycle fields that contradict the selected status', () => {
    const draftProject = createDraftProject();

    expect(
      isInvitationProject({
        ...draftProject,
        publication: {
          publicationId: 'publication_789',
          publishedAt,
        },
      }),
    ).toBe(false);

    expect(
      isInvitationProject({
        ...draftProject,
        status: 'published',
        updatedAt: publishedAt,
        publication: null,
      }),
    ).toBe(false);

    expect(
      isInvitationProject({
        ...draftProject,
        status: 'archived',
        updatedAt: archivedAt,
        archivedAt: null,
      }),
    ).toBe(false);

    expect(
      isInvitationProject({
        ...draftProject,
        status: 'archived',
        updatedAt: archivedAt,
        archivedAt: '2026-09-22T08:00:00.000Z',
      }),
    ).toBe(false);
  });

  it('rejects invalid content and malformed publication metadata', () => {
    const draftProject = createDraftProject();

    expect(
      isInvitationProject({
        ...draftProject,
        content: {
          ...draftProject.content,
          theme: 'unsupported',
        },
      }),
    ).toBe(false);

    expect(
      isInvitationProjectPublication({
        publicationId: 'publication_789' as InvitationPublicationId,
        publishedAt,
        unexpected: true,
      }),
    ).toBe(false);

    expect(
      isInvitationProjectPublication({
        publicationId: 'invalid publication',
        publishedAt,
      }),
    ).toBe(false);
  });

  it('clones nested domain values without sharing mutable references', () => {
    const publishedProject: InvitationProject = {
      ...createDraftProject(),
      status: 'published',
      updatedAt: publishedAt,
      publication: {
        publicationId: 'publication_789' as InvitationPublicationId,
        publishedAt,
      },
      archivedAt: null,
    };

    const clonedProject = cloneInvitationProject(publishedProject);

    expect(clonedProject).toEqual(publishedProject);
    expect(clonedProject).not.toBe(publishedProject);
    expect(clonedProject.content).not.toBe(publishedProject.content);
    expect(clonedProject.publication).not.toBe(publishedProject.publication);
  });

  it('does not accept arbitrary objects as invitation content', () => {
    const invalidContent = {
      ...initialInvitationDraft,
      eventTitle: 42,
    } as unknown as InvitationDraft;

    expect(
      createInvitationProject({
        ...createValidInput(),
        content: invalidContent,
      }),
    ).toEqual({
      status: 'invalid',
      project: null,
    });
  });
});
describe('invitation project lifecycle transitions', () => {
  it('defines every permitted transition explicitly', () => {
    expect(invitationProjectTransitions).toEqual({
      draft: ['published', 'archived'],
      published: ['draft', 'archived'],
      archived: ['draft'],
    });
  });

  it('publishes a draft with independent publication metadata', () => {
    const draftProject = createDraftProject();

    const result = publishInvitationProject(draftProject, {
      publicationId: 'publication_789',
      occurredAt: publishedAt,
    });

    expect(result).toEqual({
      status: 'transitioned',
      project: {
        ...draftProject,
        status: 'published',
        updatedAt: publishedAt,
        publication: {
          publicationId: 'publication_789',
          publishedAt,
        },
        archivedAt: null,
      },
      reason: null,
    });

    if (result.status !== 'transitioned') {
      throw new Error('Expected the draft project to be published');
    }

    expect(result.project).not.toBe(draftProject);
    expect(result.project.content).not.toBe(draftProject.content);
    expect(isInvitationProject(result.project)).toBe(true);
  });

  it('archives a draft without creating publication metadata', () => {
    const draftProject = createDraftProject();

    const result = archiveInvitationProject(draftProject, {
      occurredAt: archivedAt,
    });

    expect(result).toEqual({
      status: 'transitioned',
      project: {
        ...draftProject,
        status: 'archived',
        updatedAt: archivedAt,
        publication: null,
        archivedAt,
      },
      reason: null,
    });

    if (result.status !== 'transitioned') {
      throw new Error('Expected the draft project to be archived');
    }

    expect(isInvitationProject(result.project)).toBe(true);
  });

  it('unpublishes a published project and removes publication metadata', () => {
    const draftProject = createDraftProject();
    const publishedResult = publishInvitationProject(draftProject, {
      publicationId: 'publication_789',
      occurredAt: publishedAt,
    });

    if (publishedResult.status !== 'transitioned') {
      throw new Error('Expected the project fixture to be published');
    }

    const unpublishedAt = '2026-09-22T07:00:00.000Z';
    const result = unpublishInvitationProject(publishedResult.project, {
      occurredAt: unpublishedAt,
    });

    expect(result).toEqual({
      status: 'transitioned',
      project: {
        ...publishedResult.project,
        status: 'draft',
        updatedAt: unpublishedAt,
        publication: null,
        archivedAt: null,
      },
      reason: null,
    });

    if (result.status !== 'transitioned') {
      throw new Error('Expected the published project to be unpublished');
    }

    expect(isInvitationProject(result.project)).toBe(true);
  });

  it('archives a published project while preserving publication history', () => {
    const draftProject = createDraftProject();
    const publishedResult = publishInvitationProject(draftProject, {
      publicationId: 'publication_789',
      occurredAt: publishedAt,
    });

    if (publishedResult.status !== 'transitioned') {
      throw new Error('Expected the project fixture to be published');
    }

    const result = archiveInvitationProject(publishedResult.project, {
      occurredAt: archivedAt,
    });

    expect(result.status).toBe('transitioned');

    if (result.status !== 'transitioned') {
      throw new Error('Expected the published project to be archived');
    }

    expect(result.project).toEqual({
      ...publishedResult.project,
      status: 'archived',
      updatedAt: archivedAt,
      archivedAt,
    });
    expect(result.project.publication).toEqual(publishedResult.project.publication);
    expect(result.project.publication).not.toBe(publishedResult.project.publication);
    expect(isInvitationProject(result.project)).toBe(true);
  });

  it('restores an archived project as an unpublished draft', () => {
    const archivedResult = archiveInvitationProject(createDraftProject(), {
      occurredAt: archivedAt,
    });

    if (archivedResult.status !== 'transitioned') {
      throw new Error('Expected the project fixture to be archived');
    }

    const restoredAt = '2026-09-22T08:00:00.000Z';
    const result = restoreInvitationProject(archivedResult.project, {
      occurredAt: restoredAt,
    });

    expect(result).toEqual({
      status: 'transitioned',
      project: {
        ...archivedResult.project,
        status: 'draft',
        updatedAt: restoredAt,
        publication: null,
        archivedAt: null,
      },
      reason: null,
    });

    if (result.status !== 'transitioned') {
      throw new Error('Expected the archived project to be restored');
    }

    expect(isInvitationProject(result.project)).toBe(true);
  });

  it('rejects transitions that are not allowed from the current status', () => {
    const draftProject = createDraftProject();
    const publishedResult = publishInvitationProject(draftProject, {
      publicationId: 'publication_789',
      occurredAt: publishedAt,
    });

    if (publishedResult.status !== 'transitioned') {
      throw new Error('Expected the project fixture to be published');
    }

    const archivedResult = archiveInvitationProject(publishedResult.project, {
      occurredAt: archivedAt,
    });

    if (archivedResult.status !== 'transitioned') {
      throw new Error('Expected the project fixture to be archived');
    }

    expect(
      unpublishInvitationProject(draftProject, {
        occurredAt: publishedAt,
      }),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-transition',
    });

    expect(
      publishInvitationProject(publishedResult.project, {
        publicationId: 'publication_next',
        occurredAt: archivedAt,
      }),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-transition',
    });

    expect(
      publishInvitationProject(archivedResult.project, {
        publicationId: 'publication_next',
        occurredAt: '2026-09-22T08:00:00.000Z',
      }),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-transition',
    });

    expect(
      archiveInvitationProject(archivedResult.project, {
        occurredAt: '2026-09-22T08:00:00.000Z',
      }),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-transition',
    });
  });

  it('rejects malformed transition input before changing the project', () => {
    const draftProject = createDraftProject();

    expect(
      publishInvitationProject(draftProject, {
        publicationId: 'invalid publication',
        occurredAt: publishedAt,
      }),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-input',
    });

    expect(
      publishInvitationProject(draftProject, {
        publicationId: 'publication_789',
        occurredAt: '2026-09-22',
      }),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-input',
    });

    expect(
      publishInvitationProject(draftProject, {
        publicationId: 'publication_789',
        occurredAt: publishedAt,
        unexpected: true,
      } as PublishInvitationProjectInput),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-input',
    });

    expect(
      archiveInvitationProject(draftProject, {
        occurredAt: archivedAt,
        unexpected: true,
      } as InvitationProjectTransitionInput),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-input',
    });
  });

  it('rejects transitions with timestamps older than the project', () => {
    const draftProject = createDraftProject();

    expect(
      publishInvitationProject(draftProject, {
        publicationId: 'publication_789',
        occurredAt: '2026-09-22T04:59:59.999Z',
      }),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'stale-timestamp',
    });
  });

  it('rejects an invalid project before evaluating its transition', () => {
    const invalidProject = {
      ...createDraftProject(),
      content: {
        ...initialInvitationDraft,
        theme: 'unsupported',
      },
    } as unknown as InvitationProject;

    expect(
      archiveInvitationProject(invalidProject, {
        occurredAt: archivedAt,
      }),
    ).toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-project',
    });
  });
});
