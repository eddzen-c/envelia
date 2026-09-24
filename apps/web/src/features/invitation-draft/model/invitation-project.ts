import { isInvitationDraft, type InvitationDraft } from './invitation-draft';

export const invitationProjectStatuses = ['draft', 'published', 'archived'] as const;

export const invitationProjectIdentityMaxLength = 128;

declare const invitationProjectIdBrand: unique symbol;
declare const invitationOwnerIdBrand: unique symbol;
declare const invitationPublicationIdBrand: unique symbol;

export type InvitationProjectId = string &
  Readonly<{
    [invitationProjectIdBrand]: true;
  }>;

export type InvitationOwnerId = string &
  Readonly<{
    [invitationOwnerIdBrand]: true;
  }>;

export type InvitationPublicationId = string &
  Readonly<{
    [invitationPublicationIdBrand]: true;
  }>;

export type InvitationProjectStatus = (typeof invitationProjectStatuses)[number];

export type InvitationProjectPublication = Readonly<{
  publicationId: InvitationPublicationId;
  publishedAt: string;
}>;

type InvitationProjectBase = Readonly<{
  projectId: InvitationProjectId;
  ownerId: InvitationOwnerId;
  content: InvitationDraft;
  createdAt: string;
  updatedAt: string;
}>;

export type DraftInvitationProject = InvitationProjectBase &
  Readonly<{
    status: 'draft';
    publication: null;
    archivedAt: null;
  }>;

export type PublishedInvitationProject = InvitationProjectBase &
  Readonly<{
    status: 'published';
    publication: InvitationProjectPublication;
    archivedAt: null;
  }>;

export type ArchivedInvitationProject = InvitationProjectBase &
  Readonly<{
    status: 'archived';
    publication: InvitationProjectPublication | null;
    archivedAt: string;
  }>;

export type InvitationProject =
  DraftInvitationProject | PublishedInvitationProject | ArchivedInvitationProject;

export type CreateInvitationProjectInput = Readonly<{
  projectId: string;
  ownerId: string;
  content: InvitationDraft;
  createdAt: string;
}>;

export type CreateInvitationProjectResult =
  | Readonly<{
      status: 'created';
      project: DraftInvitationProject;
    }>
  | Readonly<{
      status: 'invalid';
      project: null;
    }>;

type UnknownRecord = Record<string, unknown>;

const invitationProjectKeys = [
  'projectId',
  'ownerId',
  'content',
  'status',
  'createdAt',
  'updatedAt',
  'publication',
  'archivedAt',
] as const;

const createInvitationProjectInputKeys = ['projectId', 'ownerId', 'content', 'createdAt'] as const;

const invitationProjectPublicationKeys = ['publicationId', 'publishedAt'] as const;

const invitationProjectIdentityPattern = /^[A-Za-z0-9][A-Za-z0-9_-]*$/u;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (value: UnknownRecord, expectedKeys: readonly string[]) => {
  const actualKeys = Object.keys(value);

  return (
    actualKeys.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
  );
};

const parseCanonicalTimestamp = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp) || new Date(timestamp).toISOString() !== value) {
    return null;
  }

  return timestamp;
};

const isInvitationProjectIdentity = (value: unknown) =>
  typeof value === 'string' &&
  value.length > 0 &&
  value.length <= invitationProjectIdentityMaxLength &&
  invitationProjectIdentityPattern.test(value);

const cloneInvitationDraft = (content: InvitationDraft): InvitationDraft => ({
  eventTitle: content.eventTitle,
  eventDate: content.eventDate,
  location: content.location,
  message: content.message,
  theme: content.theme,
});

const cloneInvitationProjectPublication = (
  publication: InvitationProjectPublication,
): InvitationProjectPublication => ({
  publicationId: publication.publicationId,
  publishedAt: publication.publishedAt,
});

export const isInvitationProjectStatus = (value: unknown): value is InvitationProjectStatus =>
  typeof value === 'string' && (invitationProjectStatuses as readonly string[]).includes(value);

export const isInvitationProjectPublication = (
  value: unknown,
): value is InvitationProjectPublication => {
  if (!isRecord(value) || !hasExactKeys(value, invitationProjectPublicationKeys)) {
    return false;
  }

  return (
    isInvitationProjectIdentity(value.publicationId) &&
    parseCanonicalTimestamp(value.publishedAt) !== null
  );
};

export const isInvitationProject = (value: unknown): value is InvitationProject => {
  if (!isRecord(value) || !hasExactKeys(value, invitationProjectKeys)) {
    return false;
  }

  if (
    !isInvitationProjectIdentity(value.projectId) ||
    !isInvitationProjectIdentity(value.ownerId) ||
    !isInvitationDraft(value.content) ||
    !isInvitationProjectStatus(value.status)
  ) {
    return false;
  }

  const createdAt = parseCanonicalTimestamp(value.createdAt);
  const updatedAt = parseCanonicalTimestamp(value.updatedAt);

  if (createdAt === null || updatedAt === null || updatedAt < createdAt) {
    return false;
  }

  switch (value.status) {
    case 'draft':
      return value.publication === null && value.archivedAt === null;

    case 'published': {
      if (!isInvitationProjectPublication(value.publication) || value.archivedAt !== null) {
        return false;
      }

      const publishedAt = parseCanonicalTimestamp(value.publication.publishedAt);

      return publishedAt !== null && publishedAt >= createdAt && publishedAt <= updatedAt;
    }

    case 'archived': {
      const archivedAt = parseCanonicalTimestamp(value.archivedAt);

      if (archivedAt === null || archivedAt < createdAt || archivedAt > updatedAt) {
        return false;
      }

      if (value.publication === null) {
        return true;
      }

      if (!isInvitationProjectPublication(value.publication)) {
        return false;
      }

      const publishedAt = parseCanonicalTimestamp(value.publication.publishedAt);

      return publishedAt !== null && publishedAt <= archivedAt;
    }
  }
};

export const createInvitationProject = (
  input: CreateInvitationProjectInput,
): CreateInvitationProjectResult => {
  if (
    !isRecord(input) ||
    !hasExactKeys(input, createInvitationProjectInputKeys) ||
    !isInvitationProjectIdentity(input.projectId) ||
    !isInvitationProjectIdentity(input.ownerId) ||
    !isInvitationDraft(input.content) ||
    parseCanonicalTimestamp(input.createdAt) === null
  ) {
    return {
      status: 'invalid',
      project: null,
    };
  }

  return {
    status: 'created',
    project: {
      projectId: input.projectId as InvitationProjectId,
      ownerId: input.ownerId as InvitationOwnerId,
      content: cloneInvitationDraft(input.content),
      status: 'draft',
      createdAt: input.createdAt,
      updatedAt: input.createdAt,
      publication: null,
      archivedAt: null,
    },
  };
};

export const cloneInvitationProject = (project: InvitationProject): InvitationProject => {
  const publication = project.publication
    ? cloneInvitationProjectPublication(project.publication)
    : null;

  switch (project.status) {
    case 'draft':
      return {
        ...project,
        content: cloneInvitationDraft(project.content),
      };

    case 'published':
      return {
        ...project,
        content: cloneInvitationDraft(project.content),
        publication: publication as InvitationProjectPublication,
      };

    case 'archived':
      return {
        ...project,
        content: cloneInvitationDraft(project.content),
        publication,
      };
  }
};
export const invitationProjectTransitions = {
  draft: ['published', 'archived'],
  published: ['draft', 'archived'],
  archived: ['draft'],
} as const satisfies Readonly<Record<InvitationProjectStatus, readonly InvitationProjectStatus[]>>;

export type InvitationProjectTransitionInput = Readonly<{
  occurredAt: string;
}>;

export type PublishInvitationProjectInput = InvitationProjectTransitionInput &
  Readonly<{
    publicationId: string;
  }>;

export type InvitationProjectTransitionFailureReason =
  'invalid-project' | 'invalid-input' | 'invalid-transition' | 'stale-timestamp';

export type InvitationProjectTransitionResult =
  | Readonly<{
      status: 'transitioned';
      project: InvitationProject;
      reason: null;
    }>
  | Readonly<{
      status: 'rejected';
      project: null;
      reason: InvitationProjectTransitionFailureReason;
    }>;

const invitationProjectTransitionInputKeys = ['occurredAt'] as const;

const publishInvitationProjectInputKeys = ['publicationId', 'occurredAt'] as const;

const rejectInvitationProjectTransition = (
  reason: InvitationProjectTransitionFailureReason,
): InvitationProjectTransitionResult => ({
  status: 'rejected',
  project: null,
  reason,
});

const validateTransitionTimestamp = (
  occurredAt: unknown,
  currentUpdatedAt: string,
): InvitationProjectTransitionFailureReason | null => {
  const occurredTimestamp = parseCanonicalTimestamp(occurredAt);

  if (occurredTimestamp === null) {
    return 'invalid-input';
  }

  const currentTimestamp = parseCanonicalTimestamp(currentUpdatedAt);

  if (currentTimestamp === null) {
    return 'invalid-project';
  }

  return occurredTimestamp < currentTimestamp ? 'stale-timestamp' : null;
};

const isInvitationProjectTransitionInput = (
  input: unknown,
): input is InvitationProjectTransitionInput =>
  isRecord(input) &&
  hasExactKeys(input, invitationProjectTransitionInputKeys) &&
  parseCanonicalTimestamp(input.occurredAt) !== null;

const isPublishInvitationProjectInput = (input: unknown): input is PublishInvitationProjectInput =>
  isRecord(input) &&
  hasExactKeys(input, publishInvitationProjectInputKeys) &&
  isInvitationProjectIdentity(input.publicationId) &&
  parseCanonicalTimestamp(input.occurredAt) !== null;

export const publishInvitationProject = (
  project: InvitationProject,
  input: PublishInvitationProjectInput,
): InvitationProjectTransitionResult => {
  if (!isInvitationProject(project)) {
    return rejectInvitationProjectTransition('invalid-project');
  }

  if (!isPublishInvitationProjectInput(input)) {
    return rejectInvitationProjectTransition('invalid-input');
  }

  if (project.status !== 'draft') {
    return rejectInvitationProjectTransition('invalid-transition');
  }

  const timestampFailure = validateTransitionTimestamp(input.occurredAt, project.updatedAt);

  if (timestampFailure) {
    return rejectInvitationProjectTransition(timestampFailure);
  }

  return {
    status: 'transitioned',
    project: {
      ...project,
      content: cloneInvitationDraft(project.content),
      status: 'published',
      updatedAt: input.occurredAt,
      publication: {
        publicationId: input.publicationId as InvitationPublicationId,
        publishedAt: input.occurredAt,
      },
      archivedAt: null,
    },
    reason: null,
  };
};

export const unpublishInvitationProject = (
  project: InvitationProject,
  input: InvitationProjectTransitionInput,
): InvitationProjectTransitionResult => {
  if (!isInvitationProject(project)) {
    return rejectInvitationProjectTransition('invalid-project');
  }

  if (!isInvitationProjectTransitionInput(input)) {
    return rejectInvitationProjectTransition('invalid-input');
  }

  if (project.status !== 'published') {
    return rejectInvitationProjectTransition('invalid-transition');
  }

  const timestampFailure = validateTransitionTimestamp(input.occurredAt, project.updatedAt);

  if (timestampFailure) {
    return rejectInvitationProjectTransition(timestampFailure);
  }

  return {
    status: 'transitioned',
    project: {
      ...project,
      content: cloneInvitationDraft(project.content),
      status: 'draft',
      updatedAt: input.occurredAt,
      publication: null,
      archivedAt: null,
    },
    reason: null,
  };
};

export const archiveInvitationProject = (
  project: InvitationProject,
  input: InvitationProjectTransitionInput,
): InvitationProjectTransitionResult => {
  if (!isInvitationProject(project)) {
    return rejectInvitationProjectTransition('invalid-project');
  }

  if (!isInvitationProjectTransitionInput(input)) {
    return rejectInvitationProjectTransition('invalid-input');
  }

  if (project.status === 'archived') {
    return rejectInvitationProjectTransition('invalid-transition');
  }

  const timestampFailure = validateTransitionTimestamp(input.occurredAt, project.updatedAt);

  if (timestampFailure) {
    return rejectInvitationProjectTransition(timestampFailure);
  }

  return {
    status: 'transitioned',
    project: {
      ...project,
      content: cloneInvitationDraft(project.content),
      status: 'archived',
      updatedAt: input.occurredAt,
      publication: project.publication
        ? cloneInvitationProjectPublication(project.publication)
        : null,
      archivedAt: input.occurredAt,
    },
    reason: null,
  };
};

export const restoreInvitationProject = (
  project: InvitationProject,
  input: InvitationProjectTransitionInput,
): InvitationProjectTransitionResult => {
  if (!isInvitationProject(project)) {
    return rejectInvitationProjectTransition('invalid-project');
  }

  if (!isInvitationProjectTransitionInput(input)) {
    return rejectInvitationProjectTransition('invalid-input');
  }

  if (project.status !== 'archived') {
    return rejectInvitationProjectTransition('invalid-transition');
  }

  const timestampFailure = validateTransitionTimestamp(input.occurredAt, project.updatedAt);

  if (timestampFailure) {
    return rejectInvitationProjectTransition(timestampFailure);
  }

  return {
    status: 'transitioned',
    project: {
      ...project,
      content: cloneInvitationDraft(project.content),
      status: 'draft',
      updatedAt: input.occurredAt,
      publication: null,
      archivedAt: null,
    },
    reason: null,
  };
};
