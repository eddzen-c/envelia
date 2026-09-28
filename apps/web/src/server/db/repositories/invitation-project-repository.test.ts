import { describe, expect, it, vi } from 'vitest';

import {
  createInvitationProject,
  type InvitationProject,
} from '../../../features/invitation-draft/model/invitation-project';
import { initialInvitationDraft } from '../../../features/invitation-draft/model/invitation-draft';
import type { Database } from '../client';
import { mapInvitationProjectToRow } from '../mappers/invitation-project-mapper';
import type { InvitationProjectRow } from '../schema';
import { invitationProjects } from '../schema';
import {
  createInvitationProjectRepository,
  invitationProjectListLimit,
} from './invitation-project-repository';

const createdAt = '2026-09-22T05:00:00.000Z';

const createDraftProject = () => {
  const result = createInvitationProject({
    projectId: 'project_123',
    ownerId: 'owner_456',
    content: {
      ...initialInvitationDraft,
    },
    createdAt,
  });

  if (result.status !== 'created') {
    throw new Error('Expected a valid project fixture');
  }

  return result.project;
};

const requireRow = (project: InvitationProject) => {
  const row = mapInvitationProjectToRow(project);

  if (row === null) {
    throw new Error('Expected a valid database row fixture');
  }

  return row as InvitationProjectRow;
};

const createInsertDatabase = (returnedRows: readonly InvitationProjectRow[]) => {
  const returning = vi.fn().mockResolvedValue(returnedRows);
  const onConflictDoUpdate = vi.fn().mockReturnValue({
    returning,
  });
  const values = vi.fn().mockReturnValue({
    onConflictDoUpdate,
  });
  const insert = vi.fn().mockReturnValue({
    values,
  });

  return {
    database: {
      insert,
    } as unknown as Database,
    insert,
    values,
    onConflictDoUpdate,
    returning,
  };
};

const createSelectDatabase = (returnedRows: readonly InvitationProjectRow[]) => {
  const limit = vi.fn().mockResolvedValue(returnedRows);
  const orderBy = vi.fn().mockReturnValue({
    limit,
  });
  const where = vi.fn().mockReturnValue({
    limit,
    orderBy,
  });
  const from = vi.fn().mockReturnValue({
    where,
  });
  const select = vi.fn().mockReturnValue({
    from,
  });

  return {
    database: {
      select,
    } as unknown as Database,
    select,
    from,
    where,
    orderBy,
    limit,
  };
};

describe('invitation project PostgreSQL repository', () => {
  it('saves and returns a valid project', async () => {
    const project = createDraftProject();
    const row = requireRow(project);
    const databaseMock = createInsertDatabase([row]);
    const repository = createInvitationProjectRepository(databaseMock.database);

    await expect(repository.save(project)).resolves.toEqual({
      status: 'saved',
      project,
      reason: null,
    });

    expect(databaseMock.insert).toHaveBeenCalledWith(invitationProjects);
    expect(databaseMock.values).toHaveBeenCalledWith(row);
    expect(databaseMock.onConflictDoUpdate).toHaveBeenCalledTimes(1);
    expect(databaseMock.returning).toHaveBeenCalledTimes(1);

    const conflictConfiguration = databaseMock.onConflictDoUpdate.mock.calls[0]?.[0] as {
      target: unknown;
      set: Record<string, unknown>;
      setWhere: unknown;
    };

    expect(conflictConfiguration.target).toBe(invitationProjects.projectId);
    expect(conflictConfiguration.setWhere).toBeDefined();
    expect(conflictConfiguration.set).not.toHaveProperty('projectId');
    expect(conflictConfiguration.set).not.toHaveProperty('ownerId');
    expect(conflictConfiguration.set).not.toHaveProperty('createdAt');
  });

  it('rejects an invalid project without querying PostgreSQL', async () => {
    const invalidProject = {
      ...createDraftProject(),
      ownerId: '',
    } as InvitationProject;
    const databaseMock = createInsertDatabase([]);
    const repository = createInvitationProjectRepository(databaseMock.database);

    await expect(repository.save(invalidProject)).resolves.toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-project',
    });

    expect(databaseMock.insert).not.toHaveBeenCalled();
  });

  it('reports an ownership conflict when the guarded upsert returns no row', async () => {
    const project = createDraftProject();
    const databaseMock = createInsertDatabase([]);
    const repository = createInvitationProjectRepository(databaseMock.database);

    await expect(repository.save(project)).resolves.toEqual({
      status: 'rejected',
      project: null,
      reason: 'ownership-conflict',
    });
  });

  it('rejects an invalid row returned by the upsert', async () => {
    const project = createDraftProject();
    const invalidRow = {
      ...requireRow(project),
      ownerId: '',
    } as InvitationProjectRow;
    const databaseMock = createInsertDatabase([invalidRow]);
    const repository = createInvitationProjectRepository(databaseMock.database);

    await expect(repository.save(project)).resolves.toEqual({
      status: 'rejected',
      project: null,
      reason: 'invalid-row',
    });
  });

  it('finds a project inside its owner boundary', async () => {
    const project = createDraftProject();
    const databaseMock = createSelectDatabase([requireRow(project)]);
    const repository = createInvitationProjectRepository(databaseMock.database);

    await expect(
      repository.findById({
        projectId: project.projectId,
        ownerId: project.ownerId,
      }),
    ).resolves.toEqual({
      status: 'found',
      project,
    });

    expect(databaseMock.where).toHaveBeenCalledTimes(1);
    expect(databaseMock.limit).toHaveBeenCalledWith(1);
  });

  it('reports a missing project without fabricating a value', async () => {
    const project = createDraftProject();
    const databaseMock = createSelectDatabase([]);
    const repository = createInvitationProjectRepository(databaseMock.database);

    await expect(
      repository.findById({
        projectId: project.projectId,
        ownerId: project.ownerId,
      }),
    ).resolves.toEqual({
      status: 'not-found',
      project: null,
    });
  });

  it('lists projects with stable ordering and a bounded result', async () => {
    const project = createDraftProject();
    const databaseMock = createSelectDatabase([requireRow(project)]);
    const repository = createInvitationProjectRepository(databaseMock.database);

    await expect(
      repository.listByOwner({
        ownerId: project.ownerId,
        status: 'draft',
      }),
    ).resolves.toEqual({
      status: 'loaded',
      projects: [project],
    });

    expect(databaseMock.orderBy).toHaveBeenCalledTimes(1);
    expect(databaseMock.limit).toHaveBeenCalledWith(invitationProjectListLimit);
    expect(invitationProjectListLimit).toBe(100);
  });

  it('rejects an invalid row while listing projects', async () => {
    const project = createDraftProject();
    const invalidRow = {
      ...requireRow(project),
      updatedAt: new Date('2026-09-22T04:59:59.999Z'),
    } as InvitationProjectRow;
    const databaseMock = createSelectDatabase([invalidRow]);
    const repository = createInvitationProjectRepository(databaseMock.database);

    await expect(
      repository.listByOwner({
        ownerId: project.ownerId,
      }),
    ).resolves.toEqual({
      status: 'invalid-row',
      projects: null,
    });
  });
});
