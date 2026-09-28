import {
  cloneInvitationProject,
  isInvitationProject,
  type InvitationProject,
} from '../../../features/invitation-draft/model/invitation-project';
import type { InvitationProjectRow, NewInvitationProjectRow } from '../schema';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const serializeTimestamp = (value: unknown) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return null;
  }

  return value.toISOString();
};

const deserializeTimestamp = (value: string) => new Date(value);

export const mapInvitationProjectToRow = (
  project: InvitationProject,
): NewInvitationProjectRow | null => {
  if (!isInvitationProject(project)) {
    return null;
  }

  return {
    projectId: project.projectId,
    ownerId: project.ownerId,
    eventTitle: project.content.eventTitle,
    eventDate: project.content.eventDate.length > 0 ? project.content.eventDate : null,
    location: project.content.location,
    message: project.content.message,
    theme: project.content.theme,
    status: project.status,
    createdAt: deserializeTimestamp(project.createdAt),
    updatedAt: deserializeTimestamp(project.updatedAt),
    publicationId: project.publication?.publicationId ?? null,
    publishedAt: project.publication ? deserializeTimestamp(project.publication.publishedAt) : null,
    archivedAt: project.archivedAt ? deserializeTimestamp(project.archivedAt) : null,
  };
};

export const mapInvitationProjectRowToDomain = (
  row: InvitationProjectRow,
): InvitationProject | null => {
  if (!isRecord(row)) {
    return null;
  }

  const createdAt = serializeTimestamp(row.createdAt);
  const updatedAt = serializeTimestamp(row.updatedAt);

  if (createdAt === null || updatedAt === null) {
    return null;
  }

  const publishedAt = row.publishedAt === null ? null : serializeTimestamp(row.publishedAt);

  if (row.publishedAt !== null && publishedAt === null) {
    return null;
  }

  const archivedAt = row.archivedAt === null ? null : serializeTimestamp(row.archivedAt);

  if (row.archivedAt !== null && archivedAt === null) {
    return null;
  }

  const hasPublicationId = row.publicationId !== null;
  const hasPublishedAt = publishedAt !== null;

  if (hasPublicationId !== hasPublishedAt) {
    return null;
  }

  const candidate: unknown = {
    projectId: row.projectId,
    ownerId: row.ownerId,
    content: {
      eventTitle: row.eventTitle,
      eventDate: row.eventDate ?? '',
      location: row.location,
      message: row.message,
      theme: row.theme,
    },
    status: row.status,
    createdAt,
    updatedAt,
    publication:
      row.publicationId !== null && publishedAt !== null
        ? {
            publicationId: row.publicationId,
            publishedAt,
          }
        : null,
    archivedAt,
  };

  return isInvitationProject(candidate) ? cloneInvitationProject(candidate) : null;
};
