import { describe, expect, it, vi } from 'vitest';

import { createInitialInvitationDraft } from './invitation-draft';
import {
  invitationProjectLibraryStorageKey,
  invitationProjectLibraryStorageVersion,
  loadInvitationProjectLibrary,
  parseInvitationProjectLibrary,
  persistInvitationProjectLibrary,
  serializeInvitationProjectLibrary,
  type InvitationProjectLibraryStorage,
} from './invitation-project-library-persistence';
import { createInvitationProject, type InvitationProject } from './invitation-project';

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

const createMemoryStorage = (initialValue: string | null = null) => {
  let storedValue = initialValue;

  const storage: InvitationProjectLibraryStorage = {
    getItem: vi.fn(() => storedValue),
    setItem: vi.fn((_key: string, value: string) => {
      storedValue = value;
    }),
    removeItem: vi.fn(() => {
      storedValue = null;
    }),
  };

  return {
    storage,
    read: () => storedValue,
  };
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

describe('invitation project library persistence', () => {
  it('defines a stable versioned storage contract', () => {
    expect(invitationProjectLibraryStorageVersion).toBe(1);
    expect(invitationProjectLibraryStorageKey).toBe('envelia.invitation-project-library.v1');
  });

  it('serializes all projects in a versioned envelope', () => {
    expect(JSON.parse(serializeInvitationProjectLibrary([firstProject, secondProject]))).toEqual({
      version: 1,
      projects: [firstProject, secondProject],
    });
  });

  it('parses valid projects as independent domain objects', () => {
    const projects = parseInvitationProjectLibrary(
      serializeInvitationProjectLibrary([firstProject, secondProject]),
    );

    expect(projects).toEqual([firstProject, secondProject]);
    expect(projects?.[0]).not.toBe(firstProject);
    expect(projects?.[0]?.content).not.toBe(firstProject.content);
  });

  it('rejects malformed, incompatible, or duplicated collections', () => {
    const invalidProject = {
      ...firstProject,
      ownerId: 'invalid owner',
    };

    const invalidValues = [
      'not-json',
      JSON.stringify({
        version: 2,
        projects: [],
      }),
      JSON.stringify({
        version: 1,
        projects: [invalidProject],
      }),
      JSON.stringify({
        version: 1,
        projects: [firstProject, firstProject],
      }),
      JSON.stringify({
        version: 1,
        projects: [],
        unexpected: true,
      }),
    ];

    for (const value of invalidValues) {
      expect(parseInvitationProjectLibrary(value)).toBeNull();
    }
  });

  it('reports an empty library without attempting cleanup', () => {
    const memory = createMemoryStorage();

    expect(loadInvitationProjectLibrary(memory.storage)).toEqual({
      status: 'empty',
      projects: [],
    });
    expect(memory.storage.removeItem).not.toHaveBeenCalled();
  });

  it('restores every valid project from storage', () => {
    const memory = createMemoryStorage(
      serializeInvitationProjectLibrary([firstProject, secondProject]),
    );

    expect(loadInvitationProjectLibrary(memory.storage)).toEqual({
      status: 'restored',
      projects: [firstProject, secondProject],
    });
  });

  it('discards an invalid persisted library', () => {
    const memory = createMemoryStorage('invalid');

    expect(loadInvitationProjectLibrary(memory.storage)).toEqual({
      status: 'discarded',
      projects: [],
    });
    expect(memory.read()).toBeNull();
  });

  it('reports unavailable storage when reading or cleanup fails', () => {
    const unreadableStorage: InvitationProjectLibraryStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    const uncleanableStorage: InvitationProjectLibraryStorage = {
      getItem: () => 'invalid',
      setItem: vi.fn(),
      removeItem: () => {
        throw new Error('blocked');
      },
    };

    expect(loadInvitationProjectLibrary(unreadableStorage)).toEqual({
      status: 'unavailable',
      projects: [],
    });
    expect(loadInvitationProjectLibrary(uncleanableStorage)).toEqual({
      status: 'unavailable',
      projects: [],
    });
  });

  it('persists a valid collection', () => {
    const memory = createMemoryStorage();

    expect(persistInvitationProjectLibrary(memory.storage, [firstProject, secondProject])).toBe(
      'saved',
    );

    expect(memory.read()).toBe(serializeInvitationProjectLibrary([firstProject, secondProject]));
  });

  it('removes the storage entry when the collection becomes empty', () => {
    const memory = createMemoryStorage(serializeInvitationProjectLibrary([firstProject]));

    expect(persistInvitationProjectLibrary(memory.storage, [])).toBe('cleared');
    expect(memory.read()).toBeNull();
  });

  it('refuses invalid projects and duplicated identifiers', () => {
    const memory = createMemoryStorage();
    const invalidProject = {
      ...firstProject,
      projectId: 'invalid project id',
    } as unknown as InvitationProject;

    expect(persistInvitationProjectLibrary(memory.storage, [invalidProject])).toBe('invalid');
    expect(persistInvitationProjectLibrary(memory.storage, [firstProject, firstProject])).toBe(
      'invalid',
    );
    expect(memory.storage.setItem).not.toHaveBeenCalled();
  });

  it('contains storage write and removal failures', () => {
    const unavailableStorage: InvitationProjectLibraryStorage = {
      getItem: vi.fn(),
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };

    expect(persistInvitationProjectLibrary(unavailableStorage, [firstProject])).toBe('unavailable');
    expect(persistInvitationProjectLibrary(unavailableStorage, [])).toBe('unavailable');
  });
});
