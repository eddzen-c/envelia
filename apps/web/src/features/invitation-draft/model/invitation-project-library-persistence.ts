import {
  cloneInvitationProject,
  isInvitationProject,
  type InvitationProject,
} from './invitation-project';

export const invitationProjectLibraryStorageVersion = 1 as const;

export const invitationProjectLibraryStorageKey = 'envelia.invitation-project-library.v1';

export type InvitationProjectLibraryStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type InvitationProjectLibraryLoadResult =
  | Readonly<{
      status: 'empty' | 'discarded' | 'unavailable';
      projects: readonly [];
    }>
  | Readonly<{
      status: 'restored';
      projects: readonly InvitationProject[];
    }>;

export type InvitationProjectLibrarySaveResult = 'saved' | 'cleared' | 'invalid' | 'unavailable';

type UnknownRecord = Record<string, unknown>;

type InvitationProjectLibraryEnvelope = Readonly<{
  version: typeof invitationProjectLibraryStorageVersion;
  projects: readonly InvitationProject[];
}>;

const invitationProjectLibraryEnvelopeKeys = ['version', 'projects'] as const;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (value: UnknownRecord, expectedKeys: readonly string[]) => {
  const actualKeys = Object.keys(value);

  return (
    actualKeys.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
  );
};

const isInvitationProjectCollection = (value: unknown): value is readonly InvitationProject[] => {
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

const cloneInvitationProjects = (projects: readonly InvitationProject[]) =>
  projects.map((project) => cloneInvitationProject(project));

export const serializeInvitationProjectLibrary = (projects: readonly InvitationProject[]) => {
  const envelope: InvitationProjectLibraryEnvelope = {
    version: invitationProjectLibraryStorageVersion,
    projects: cloneInvitationProjects(projects),
  };

  return JSON.stringify(envelope);
};

export const parseInvitationProjectLibrary = (
  serializedLibrary: string,
): readonly InvitationProject[] | null => {
  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(serializedLibrary) as unknown;
  } catch {
    return null;
  }

  if (
    !isRecord(parsedValue) ||
    !hasExactKeys(parsedValue, invitationProjectLibraryEnvelopeKeys) ||
    parsedValue.version !== invitationProjectLibraryStorageVersion ||
    !isInvitationProjectCollection(parsedValue.projects)
  ) {
    return null;
  }

  return cloneInvitationProjects(parsedValue.projects);
};

export const loadInvitationProjectLibrary = (
  storage: InvitationProjectLibraryStorage,
): InvitationProjectLibraryLoadResult => {
  let serializedLibrary: string | null;

  try {
    serializedLibrary = storage.getItem(invitationProjectLibraryStorageKey);
  } catch {
    return {
      status: 'unavailable',
      projects: [],
    };
  }

  if (serializedLibrary === null) {
    return {
      status: 'empty',
      projects: [],
    };
  }

  const projects = parseInvitationProjectLibrary(serializedLibrary);

  if (projects) {
    return {
      status: 'restored',
      projects,
    };
  }

  try {
    storage.removeItem(invitationProjectLibraryStorageKey);

    return {
      status: 'discarded',
      projects: [],
    };
  } catch {
    return {
      status: 'unavailable',
      projects: [],
    };
  }
};

export const persistInvitationProjectLibrary = (
  storage: InvitationProjectLibraryStorage,
  projects: readonly InvitationProject[],
): InvitationProjectLibrarySaveResult => {
  try {
    if (!isInvitationProjectCollection(projects)) {
      return 'invalid';
    }

    if (projects.length === 0) {
      storage.removeItem(invitationProjectLibraryStorageKey);

      return 'cleared';
    }

    storage.setItem(
      invitationProjectLibraryStorageKey,
      serializeInvitationProjectLibrary(projects),
    );

    return 'saved';
  } catch {
    return 'unavailable';
  }
};
