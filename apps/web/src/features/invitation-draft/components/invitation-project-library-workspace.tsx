'use client';

import { useEffect, useState } from 'react';

import { createInitialInvitationDraft, type InvitationDraft } from '../model/invitation-draft';
import {
  invitationDraftStorageKey,
  loadInvitationDraft,
} from '../model/invitation-draft-persistence';
import {
  createInvitationProjectInLibrary,
  deleteInvitationProjectFromLibrary,
  duplicateInvitationProjectInLibrary,
  sortInvitationProjectLibrary,
  updateInvitationProjectInLibrary,
} from '../model/invitation-project-library';
import {
  loadInvitationProjectLibrary,
  persistInvitationProjectLibrary,
  type InvitationProjectLibraryStorage,
} from '../model/invitation-project-library-persistence';
import type { InvitationProject } from '../model/invitation-project';
import { InvitationDraftEditor } from './invitation-draft-editor';
import { InvitationProjectList } from './invitation-project-list';
import type { InvitationShareEnvironment } from './invitation-share-controls';

type InvitationProjectLibraryWorkspaceProps = Readonly<{
  storage?: InvitationProjectLibraryStorage;
  createProjectId?: () => string;
  getCurrentTimestamp?: () => string;
  confirmDelete?: (project: InvitationProject) => boolean;
  shareEnvironment?: InvitationShareEnvironment;
}>;

type LibraryStatus =
  'checking' | 'ready' | 'restored' | 'migrated' | 'discarded' | 'saved' | 'unavailable';

const libraryStatusMessages: Readonly<Record<LibraryStatus, string>> = {
  checking: 'Comprobando tus invitaciones guardadas…',
  ready: 'Tus invitaciones se guardarán en este navegador.',
  restored: 'Invitaciones recuperadas de este navegador.',
  migrated: 'Tu borrador anterior se agregó a Mis invitaciones.',
  discarded: 'Se descartaron datos guardados que ya no eran válidos.',
  saved: 'Cambios guardados en este navegador.',
  unavailable: 'El guardado local no está disponible. Puedes continuar durante esta sesión.',
};

const resolveStorage = (
  storage: InvitationProjectLibraryStorage | undefined,
): InvitationProjectLibraryStorage | null => {
  if (storage) {
    return storage;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const defaultCreateProjectId = () => {
  try {
    return globalThis.crypto.randomUUID();
  } catch {
    return `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
};

const defaultGetCurrentTimestamp = () => new Date().toISOString();

const defaultConfirmDelete = (project: InvitationProject) => {
  const title = project.content.eventTitle.trim() || 'Invitación sin título';

  return window.confirm(`¿Quieres eliminar "${title}"? Esta acción no se puede deshacer.`);
};

const getProjectTitle = (project: InvitationProject) =>
  project.content.eventTitle.trim() || 'Invitación sin título';

export function InvitationProjectLibraryWorkspace({
  storage,
  createProjectId = defaultCreateProjectId,
  getCurrentTimestamp = defaultGetCurrentTimestamp,
  confirmDelete = defaultConfirmDelete,
  shareEnvironment,
}: InvitationProjectLibraryWorkspaceProps) {
  const [projects, setProjects] = useState<readonly InvitationProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [libraryStatus, setLibraryStatus] = useState<LibraryStatus>('checking');

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      const availableStorage = resolveStorage(storage);

      if (!availableStorage) {
        setLibraryStatus('unavailable');
        return;
      }

      const libraryResult = loadInvitationProjectLibrary(availableStorage);

      if (libraryResult.status === 'restored') {
        setProjects(sortInvitationProjectLibrary(libraryResult.projects));
        setLibraryStatus('restored');
        return;
      }

      if (libraryResult.status === 'unavailable') {
        setLibraryStatus('unavailable');
        return;
      }

      if (libraryResult.status === 'discarded') {
        setLibraryStatus('discarded');
        return;
      }

      const legacyDraftResult = loadInvitationDraft(availableStorage);

      if (legacyDraftResult.status === 'restored') {
        const migrationResult = createInvitationProjectInLibrary([], {
          projectId: createProjectId(),
          content: legacyDraftResult.draft,
          occurredAt: getCurrentTimestamp(),
        });

        if (migrationResult.status !== 'created') {
          setLibraryStatus('unavailable');
          return;
        }

        setProjects(migrationResult.projects);

        const saveResult = persistInvitationProjectLibrary(
          availableStorage,
          migrationResult.projects,
        );

        if (saveResult !== 'saved') {
          setLibraryStatus('unavailable');
          return;
        }

        try {
          availableStorage.removeItem(invitationDraftStorageKey);
          setLibraryStatus('migrated');
        } catch {
          setLibraryStatus('unavailable');
        }

        return;
      }

      if (legacyDraftResult.status === 'unavailable') {
        setLibraryStatus('unavailable');
        return;
      }

      if (legacyDraftResult.status === 'discarded') {
        setLibraryStatus('discarded');
        return;
      }

      setLibraryStatus('ready');
    });

    return () => {
      isActive = false;
    };
  }, [createProjectId, getCurrentTimestamp, storage]);

  const persistProjects = (nextProjects: readonly InvitationProject[]) => {
    setProjects(nextProjects);

    const availableStorage = resolveStorage(storage);

    if (!availableStorage) {
      setLibraryStatus('unavailable');
      return;
    }

    const saveResult = persistInvitationProjectLibrary(availableStorage, nextProjects);

    setLibraryStatus(saveResult === 'saved' || saveResult === 'cleared' ? 'saved' : 'unavailable');
  };

  const createProject = () => {
    const result = createInvitationProjectInLibrary(projects, {
      projectId: createProjectId(),
      content: createInitialInvitationDraft(),
      occurredAt: getCurrentTimestamp(),
    });

    if (result.status !== 'created') {
      setLibraryStatus('unavailable');
      return;
    }

    persistProjects(result.projects);
    setActiveProjectId(result.project.projectId);
  };

  const openProject = (projectId: string) => {
    setActiveProjectId(projectId);
  };

  const duplicateProject = (sourceProjectId: string) => {
    const result = duplicateInvitationProjectInLibrary(projects, {
      sourceProjectId,
      projectId: createProjectId(),
      occurredAt: getCurrentTimestamp(),
    });

    if (result.status !== 'duplicated') {
      setLibraryStatus('unavailable');
      return;
    }

    persistProjects(result.projects);
  };

  const deleteProject = (projectId: string) => {
    const project = projects.find((candidate) => candidate.projectId === projectId);

    if (!project || !confirmDelete(project)) {
      return;
    }

    const result = deleteInvitationProjectFromLibrary(projects, projectId);

    if (result.status !== 'deleted') {
      setLibraryStatus('unavailable');
      return;
    }

    persistProjects(result.projects);
  };

  const updateProjectDraft = (projectId: string, draft: InvitationDraft) => {
    const result = updateInvitationProjectInLibrary(projects, {
      projectId,
      content: draft,
      occurredAt: getCurrentTimestamp(),
    });

    if (result.status !== 'updated') {
      setLibraryStatus('unavailable');
      return;
    }

    persistProjects(result.projects);
  };

  const activeProject =
    activeProjectId === null
      ? null
      : (projects.find((project) => project.projectId === activeProjectId) ?? null);

  if (libraryStatus === 'checking') {
    return (
      <div
        aria-atomic="true"
        aria-label="Estado de la biblioteca"
        className="rounded-[2rem] border border-border bg-surface px-6 py-12 text-center text-muted shadow-soft"
        role="status"
      >
        {libraryStatusMessages.checking}
      </div>
    );
  }

  if (activeProject) {
    const title = getProjectTitle(activeProject);

    return (
      <div>
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-border bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-bold tracking-[0.18em] text-primary uppercase">
              Editando proyecto
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
              {title}
            </h2>
          </div>

          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold text-foreground hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => {
              setActiveProjectId(null);
            }}
            type="button"
          >
            Volver a Mis invitaciones
          </button>
        </div>

        <InvitationDraftEditor
          draft={activeProject.content}
          onDraftChange={(draft) => {
            updateProjectDraft(activeProject.projectId, draft);
          }}
          onReset={() => {
            updateProjectDraft(activeProject.projectId, createInitialInvitationDraft());
          }}
          persistenceMessage={libraryStatusMessages[libraryStatus]}
          persistenceUnavailable={libraryStatus === 'unavailable'}
          {...(shareEnvironment ? { shareEnvironment } : {})}
        />
      </div>
    );
  }

  return (
    <div>
      <div
        aria-atomic="true"
        aria-label="Estado de la biblioteca"
        className="mb-6 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted"
        role="status"
      >
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${
            libraryStatus === 'unavailable' ? 'bg-amber-500' : 'bg-primary'
          }`}
        />
        {libraryStatusMessages[libraryStatus]}
      </div>

      <InvitationProjectList
        projects={projects}
        onCreate={createProject}
        onDelete={deleteProject}
        onDuplicate={duplicateProject}
        onOpen={openProject}
      />
    </div>
  );
}
