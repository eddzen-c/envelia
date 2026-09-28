import { isInvitationDraft, type InvitationDraft } from './invitation-draft';
import {
  cloneInvitationProject,
  createInvitationProject,
  isInvitationProject,
  type InvitationProject,
} from './invitation-project';

export const localInvitationProjectOwnerId = 'local-browser';

export type InvitationProjectLibraryOperation = 'created' | 'updated' | 'duplicated' | 'deleted';

export type InvitationProjectLibraryRejectionReason =
  | 'invalid-library'
  | 'invalid-input'
  | 'duplicate-id'
  | 'not-found'
  | 'not-editable'
  | 'stale-timestamp';

export type InvitationProjectLibraryOperationResult =
  | Readonly<{
      status: InvitationProjectLibraryOperation;
      projects: readonly InvitationProject[];
      project: InvitationProject;
      reason: null;
    }>
  | Readonly<{
      status: 'rejected';
      projects: null;
      project: null;
      reason: InvitationProjectLibraryRejectionReason;
    }>;

export type CreateInvitationProjectInLibraryInput = Readonly<{
  projectId: string;
  content: InvitationDraft;
  occurredAt: string;
}>;

export type UpdateInvitationProjectInLibraryInput = Readonly<{
  projectId: string;
  content: InvitationDraft;
  occurredAt: string;
}>;

export type DuplicateInvitationProjectInLibraryInput = Readonly<{
  sourceProjectId: string;
  projectId: string;
  occurredAt: string;
}>;

type UnknownRecord = Record<string, unknown>;

const createInputKeys = ['projectId', 'content', 'occurredAt'] as const;
const updateInputKeys = ['projectId', 'content', 'occurredAt'] as const;
const duplicateInputKeys = ['sourceProjectId', 'projectId', 'occurredAt'] as const;

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

const isInvitationProjectLibrary = (value: unknown): value is readonly InvitationProject[] => {
  if (!Array.isArray(value)) {
    return false;
  }

  const projectIds = new Set<string>();

  for (const project of value) {
    if (!isInvitationProject(project) || projectIds.has(project.projectId)) {
      return false;
    }

    projectIds.add(project.projectId);
  }

  return true;
};

const cloneInvitationDraft = (content: InvitationDraft): InvitationDraft => ({
  eventTitle: content.eventTitle,
  eventDate: content.eventDate,
  location: content.location,
  message: content.message,
  theme: content.theme,
});

const compareProjectIds = (left: string, right: string) => {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
};

export const sortInvitationProjectLibrary = (
  projects: readonly InvitationProject[],
): readonly InvitationProject[] =>
  projects
    .map((project) => cloneInvitationProject(project))
    .sort((left, right) => {
      const timestampDifference =
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();

      return timestampDifference !== 0
        ? timestampDifference
        : compareProjectIds(left.projectId, right.projectId);
    });

const rejectOperation = (
  reason: InvitationProjectLibraryRejectionReason,
): InvitationProjectLibraryOperationResult => ({
  status: 'rejected',
  projects: null,
  project: null,
  reason,
});

const completeOperation = (
  status: InvitationProjectLibraryOperation,
  projects: readonly InvitationProject[],
  project: InvitationProject,
): InvitationProjectLibraryOperationResult => ({
  status,
  projects: sortInvitationProjectLibrary(projects),
  project: cloneInvitationProject(project),
  reason: null,
});

const containsProjectId = (projects: readonly InvitationProject[], projectId: string) =>
  projects.some((project) => project.projectId === projectId);

const isCreateInput = (input: unknown): input is CreateInvitationProjectInLibraryInput =>
  isRecord(input) &&
  hasExactKeys(input, createInputKeys) &&
  typeof input.projectId === 'string' &&
  isInvitationDraft(input.content) &&
  parseCanonicalTimestamp(input.occurredAt) !== null;

const isUpdateInput = (input: unknown): input is UpdateInvitationProjectInLibraryInput =>
  isRecord(input) &&
  hasExactKeys(input, updateInputKeys) &&
  typeof input.projectId === 'string' &&
  isInvitationDraft(input.content) &&
  parseCanonicalTimestamp(input.occurredAt) !== null;

const isDuplicateInput = (input: unknown): input is DuplicateInvitationProjectInLibraryInput =>
  isRecord(input) &&
  hasExactKeys(input, duplicateInputKeys) &&
  typeof input.sourceProjectId === 'string' &&
  typeof input.projectId === 'string' &&
  parseCanonicalTimestamp(input.occurredAt) !== null;

export const createInvitationProjectInLibrary = (
  projects: readonly InvitationProject[],
  input: CreateInvitationProjectInLibraryInput,
): InvitationProjectLibraryOperationResult => {
  if (!isInvitationProjectLibrary(projects)) {
    return rejectOperation('invalid-library');
  }

  if (!isCreateInput(input)) {
    return rejectOperation('invalid-input');
  }

  if (containsProjectId(projects, input.projectId)) {
    return rejectOperation('duplicate-id');
  }

  const creationResult = createInvitationProject({
    projectId: input.projectId,
    ownerId: localInvitationProjectOwnerId,
    content: input.content,
    createdAt: input.occurredAt,
  });

  if (creationResult.status !== 'created') {
    return rejectOperation('invalid-input');
  }

  return completeOperation(
    'created',
    [...projects, creationResult.project],
    creationResult.project,
  );
};

export const updateInvitationProjectInLibrary = (
  projects: readonly InvitationProject[],
  input: UpdateInvitationProjectInLibraryInput,
): InvitationProjectLibraryOperationResult => {
  if (!isInvitationProjectLibrary(projects)) {
    return rejectOperation('invalid-library');
  }

  if (!isUpdateInput(input)) {
    return rejectOperation('invalid-input');
  }

  const existingProject = projects.find((project) => project.projectId === input.projectId);

  if (!existingProject) {
    return rejectOperation('not-found');
  }

  if (existingProject.status !== 'draft') {
    return rejectOperation('not-editable');
  }

  const occurredAt = parseCanonicalTimestamp(input.occurredAt);
  const currentUpdatedAt = parseCanonicalTimestamp(existingProject.updatedAt);

  if (occurredAt === null || currentUpdatedAt === null || occurredAt < currentUpdatedAt) {
    return rejectOperation('stale-timestamp');
  }

  const updatedProject: InvitationProject = {
    ...existingProject,
    content: cloneInvitationDraft(input.content),
    updatedAt: input.occurredAt,
  };

  if (!isInvitationProject(updatedProject)) {
    return rejectOperation('invalid-input');
  }

  const updatedProjects = projects.map((project) =>
    project.projectId === updatedProject.projectId ? updatedProject : project,
  );

  return completeOperation('updated', updatedProjects, updatedProject);
};

export const duplicateInvitationProjectInLibrary = (
  projects: readonly InvitationProject[],
  input: DuplicateInvitationProjectInLibraryInput,
): InvitationProjectLibraryOperationResult => {
  if (!isInvitationProjectLibrary(projects)) {
    return rejectOperation('invalid-library');
  }

  if (!isDuplicateInput(input)) {
    return rejectOperation('invalid-input');
  }

  const sourceProject = projects.find((project) => project.projectId === input.sourceProjectId);

  if (!sourceProject) {
    return rejectOperation('not-found');
  }

  if (containsProjectId(projects, input.projectId)) {
    return rejectOperation('duplicate-id');
  }

  const creationResult = createInvitationProject({
    projectId: input.projectId,
    ownerId: localInvitationProjectOwnerId,
    content: sourceProject.content,
    createdAt: input.occurredAt,
  });

  if (creationResult.status !== 'created') {
    return rejectOperation('invalid-input');
  }

  return completeOperation(
    'duplicated',
    [...projects, creationResult.project],
    creationResult.project,
  );
};

export const deleteInvitationProjectFromLibrary = (
  projects: readonly InvitationProject[],
  projectId: string,
): InvitationProjectLibraryOperationResult => {
  if (!isInvitationProjectLibrary(projects)) {
    return rejectOperation('invalid-library');
  }

  if (typeof projectId !== 'string' || projectId.length === 0) {
    return rejectOperation('invalid-input');
  }

  const project = projects.find((candidate) => candidate.projectId === projectId);

  if (!project) {
    return rejectOperation('not-found');
  }

  return completeOperation(
    'deleted',
    projects.filter((candidate) => candidate.projectId !== projectId),
    project,
  );
};
