import { and, asc, desc, eq } from 'drizzle-orm';

import type {
  InvitationOwnerId,
  InvitationProject,
  InvitationProjectId,
  InvitationProjectStatus,
} from '../../../features/invitation-draft/model/invitation-project';
import type { Database } from '../client';
import {
  mapInvitationProjectRowToDomain,
  mapInvitationProjectToRow,
} from '../mappers/invitation-project-mapper';
import { invitationProjects } from '../schema';

export type SaveInvitationProjectResult =
  | Readonly<{
      status: 'saved';
      project: InvitationProject;
      reason: null;
    }>
  | Readonly<{
      status: 'rejected';
      project: null;
      reason: 'invalid-project' | 'ownership-conflict' | 'invalid-row';
    }>;

export type FindInvitationProjectInput = Readonly<{
  projectId: InvitationProjectId;
  ownerId: InvitationOwnerId;
}>;

export type FindInvitationProjectResult =
  | Readonly<{
      status: 'found';
      project: InvitationProject;
    }>
  | Readonly<{
      status: 'not-found' | 'invalid-row';
      project: null;
    }>;

export type ListInvitationProjectsInput = Readonly<{
  ownerId: InvitationOwnerId;
  status?: InvitationProjectStatus;
}>;

export type ListInvitationProjectsResult =
  | Readonly<{
      status: 'loaded';
      projects: readonly InvitationProject[];
    }>
  | Readonly<{
      status: 'invalid-row';
      projects: null;
    }>;

export const invitationProjectListLimit = 100;

export const createInvitationProjectRepository = (database: Database) => ({
  save: async (project: InvitationProject): Promise<SaveInvitationProjectResult> => {
    const row = mapInvitationProjectToRow(project);

    if (row === null) {
      return {
        status: 'rejected',
        project: null,
        reason: 'invalid-project',
      };
    }

    const savedRows = await database
      .insert(invitationProjects)
      .values(row)
      .onConflictDoUpdate({
        target: invitationProjects.projectId,
        set: {
          eventTitle: row.eventTitle,
          eventDate: row.eventDate,
          location: row.location,
          message: row.message,
          theme: row.theme,
          status: row.status,
          updatedAt: row.updatedAt,
          publicationId: row.publicationId,
          publishedAt: row.publishedAt,
          archivedAt: row.archivedAt,
        },
        setWhere: eq(invitationProjects.ownerId, row.ownerId),
      })
      .returning();

    const savedRow = savedRows[0];

    if (!savedRow) {
      return {
        status: 'rejected',
        project: null,
        reason: 'ownership-conflict',
      };
    }

    const savedProject = mapInvitationProjectRowToDomain(savedRow);

    if (savedProject === null) {
      return {
        status: 'rejected',
        project: null,
        reason: 'invalid-row',
      };
    }

    return {
      status: 'saved',
      project: savedProject,
      reason: null,
    };
  },

  findById: async (input: FindInvitationProjectInput): Promise<FindInvitationProjectResult> => {
    const rows = await database
      .select()
      .from(invitationProjects)
      .where(
        and(
          eq(invitationProjects.projectId, input.projectId),
          eq(invitationProjects.ownerId, input.ownerId),
        ),
      )
      .limit(1);

    const row = rows[0];

    if (!row) {
      return {
        status: 'not-found',
        project: null,
      };
    }

    const project = mapInvitationProjectRowToDomain(row);

    if (project === null) {
      return {
        status: 'invalid-row',
        project: null,
      };
    }

    return {
      status: 'found',
      project,
    };
  },

  listByOwner: async (
    input: ListInvitationProjectsInput,
  ): Promise<ListInvitationProjectsResult> => {
    const ownerCondition = eq(invitationProjects.ownerId, input.ownerId);

    const condition = input.status
      ? and(ownerCondition, eq(invitationProjects.status, input.status))
      : ownerCondition;

    const rows = await database
      .select()
      .from(invitationProjects)
      .where(condition)
      .orderBy(desc(invitationProjects.updatedAt), asc(invitationProjects.projectId))
      .limit(invitationProjectListLimit);

    const projects: InvitationProject[] = [];

    for (const row of rows) {
      const project = mapInvitationProjectRowToDomain(row);

      if (project === null) {
        return {
          status: 'invalid-row',
          projects: null,
        };
      }

      projects.push(project);
    }

    return {
      status: 'loaded',
      projects,
    };
  },
});

export type InvitationProjectRepository = ReturnType<typeof createInvitationProjectRepository>;
