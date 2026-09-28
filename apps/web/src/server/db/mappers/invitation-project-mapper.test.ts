import { describe, expect, it } from 'vitest';

import {
  archiveInvitationProject,
  createInvitationProject,
  publishInvitationProject,
  type InvitationProject,
} from '../../../features/invitation-draft/model/invitation-project';
import {
  initialInvitationDraft,
  type InvitationDraft,
} from '../../../features/invitation-draft/model/invitation-draft';
import type { InvitationProjectRow } from '../schema';
import {
  mapInvitationProjectRowToDomain,
  mapInvitationProjectToRow,
} from './invitation-project-mapper';

const createdAt = '2026-09-22T05:00:00.000Z';
const publishedAt = '2026-09-22T06:00:00.000Z';
const archivedAt = '2026-09-22T07:00:00.000Z';

const createDraftProject = (content: InvitationDraft = initialInvitationDraft) => {
  const result = createInvitationProject({
    projectId: 'project_123',
    ownerId: 'owner_456',
    content,
    createdAt,
  });

  if (result.status !== 'created') {
    throw new Error('Expected a valid draft project fixture');
  }

  return result.project;
};

const createPublishedProject = () => {
  const result = publishInvitationProject(createDraftProject(), {
    publicationId: 'publication_789',
    occurredAt: publishedAt,
  });

  if (result.status !== 'transitioned') {
    throw new Error('Expected a valid published project fixture');
  }

  return result.project;
};

const createArchivedPublishedProject = () => {
  const result = archiveInvitationProject(createPublishedProject(), {
    occurredAt: archivedAt,
  });

  if (result.status !== 'transitioned') {
    throw new Error('Expected a valid archived project fixture');
  }

  return result.project;
};

const requireRow = (project: InvitationProject) => {
  const row = mapInvitationProjectToRow(project);

  if (row === null) {
    throw new Error('Expected the project to map to a database row');
  }

  return row as InvitationProjectRow;
};

describe('invitation project database mapper', () => {
  it('maps a draft project to the normalized PostgreSQL row', () => {
    const project = createDraftProject();
    const row = mapInvitationProjectToRow(project);

    expect(row).toEqual({
      projectId: 'project_123',
      ownerId: 'owner_456',
      eventTitle: initialInvitationDraft.eventTitle,
      eventDate: initialInvitationDraft.eventDate,
      location: initialInvitationDraft.location,
      message: initialInvitationDraft.message,
      theme: initialInvitationDraft.theme,
      status: 'draft',
      createdAt: new Date(createdAt),
      updatedAt: new Date(createdAt),
      publicationId: null,
      publishedAt: null,
      archivedAt: null,
    });
  });

  it('stores an empty editable event date as SQL null', () => {
    const project = createDraftProject({
      ...initialInvitationDraft,
      eventDate: '',
    });

    expect(mapInvitationProjectToRow(project)?.eventDate).toBeNull();
  });

  it('restores SQL null as the empty editable event date', () => {
    const project = createDraftProject({
      ...initialInvitationDraft,
      eventDate: '',
    });
    const row = requireRow(project);

    expect(mapInvitationProjectRowToDomain(row)).toEqual(project);
  });

  it('round-trips a published project without losing metadata', () => {
    const project = createPublishedProject();
    const row = requireRow(project);
    const restoredProject = mapInvitationProjectRowToDomain(row);

    expect(restoredProject).toEqual(project);
    expect(restoredProject?.content).not.toBe(project.content);
    expect(restoredProject?.publication).not.toBe(project.publication);
  });

  it('round-trips an archived project with publication history', () => {
    const project = createArchivedPublishedProject();
    const row = requireRow(project);

    expect(mapInvitationProjectRowToDomain(row)).toEqual(project);
  });

  it('rejects rows with incomplete publication metadata', () => {
    const row = requireRow(createDraftProject());

    expect(
      mapInvitationProjectRowToDomain({
        ...row,
        publicationId: 'publication_789',
        publishedAt: null,
      }),
    ).toBeNull();
  });

  it('rejects rows with invalid database timestamps', () => {
    const row = requireRow(createDraftProject());

    expect(
      mapInvitationProjectRowToDomain({
        ...row,
        createdAt: new Date(Number.NaN),
      }),
    ).toBeNull();
  });

  it('rejects rows that violate domain chronology', () => {
    const row = requireRow(createDraftProject());

    expect(
      mapInvitationProjectRowToDomain({
        ...row,
        updatedAt: new Date('2026-09-22T04:59:59.999Z'),
      }),
    ).toBeNull();
  });

  it('rejects invalid projects before producing a row', () => {
    const invalidProject = {
      ...createDraftProject(),
      ownerId: '',
    } as InvitationProject;

    expect(mapInvitationProjectToRow(invalidProject)).toBeNull();
  });
});
