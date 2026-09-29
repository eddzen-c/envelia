'use client';

import { formatInvitationDate, invitationPreviewFallbacks } from '../model/invitation-draft';
import type { InvitationProject, InvitationProjectStatus } from '../model/invitation-project';

type InvitationProjectListProps = Readonly<{
  projects: readonly InvitationProject[];
  onCreate: () => void;
  onOpen: (projectId: string) => void;
  onDuplicate: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}>;

const invitationProjectStatusLabels: Readonly<Record<InvitationProjectStatus, string>> = {
  draft: 'Borrador',
  published: 'Publicada',
  archived: 'Archivada',
};

const updatedAtFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const getProjectTitle = (project: InvitationProject) => {
  const title = project.content.eventTitle.trim();

  return title.length > 0 ? title : 'Invitación sin título';
};

const getProjectLocation = (project: InvitationProject) => {
  const location = project.content.location.trim();

  return location.length > 0 ? location : invitationPreviewFallbacks.location;
};

const formatUpdatedAt = (updatedAt: string) => updatedAtFormatter.format(new Date(updatedAt));

export function InvitationProjectList({
  projects,
  onCreate,
  onOpen,
  onDuplicate,
  onDelete,
}: InvitationProjectListProps) {
  return (
    <section aria-labelledby="invitation-library-title">
      <div className="flex flex-col gap-5 rounded-[2rem] border border-border bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-sm font-bold tracking-[0.18em] text-primary uppercase">Tu colección</p>
          <h2
            className="mt-2 font-display text-3xl font-semibold text-foreground"
            id="invitation-library-title"
          >
            Mis invitaciones
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted">
            Crea, continúa y organiza tus invitaciones guardadas en este navegador.
          </p>
        </div>

        <button
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={onCreate}
          type="button"
        >
          Nueva invitación
        </button>
      </div>

      {projects.length === 0 ? (
        <div
          className="mt-6 rounded-[2rem] border border-dashed border-brand-300 bg-brand-50 px-6 py-12 text-center"
          role="status"
        >
          <p className="font-display text-2xl font-semibold text-foreground">
            Aún no tienes invitaciones
          </p>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-muted">
            Crea tu primera invitación y comienza a personalizar su fecha, lugar, mensaje y estilo.
          </p>
          <button
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onCreate}
            type="button"
          >
            Crear mi primera invitación
          </button>
        </div>
      ) : (
        <ul
          aria-label="Proyectos de invitación"
          className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {projects.map((project) => {
            const title = getProjectTitle(project);
            const titleId = `invitation-project-${project.projectId}-title`;

            return (
              <li key={project.projectId}>
                <article
                  aria-labelledby={titleId}
                  className="flex h-full flex-col rounded-[2rem] border border-border bg-surface p-5 shadow-soft sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                        {invitationProjectStatusLabels[project.status]}
                      </p>
                      <h3
                        className="mt-2 font-display text-2xl font-semibold text-foreground"
                        id={titleId}
                      >
                        {title}
                      </h3>
                    </div>

                    <span
                      aria-label={`Tema ${project.content.theme}`}
                      className="size-4 shrink-0 rounded-full bg-primary"
                      title={`Tema ${project.content.theme}`}
                    />
                  </div>

                  <dl className="mt-6 grid gap-4 text-sm">
                    <div>
                      <dt className="font-semibold text-foreground">Fecha</dt>
                      <dd className="mt-1 text-muted">
                        {formatInvitationDate(project.content.eventDate)}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-foreground">Lugar</dt>
                      <dd className="mt-1 text-muted">{getProjectLocation(project)}</dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-foreground">Última modificación</dt>
                      <dd className="mt-1 text-muted">{formatUpdatedAt(project.updatedAt)}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-7">
                    <button
                      aria-label={`Abrir ${title}`}
                      className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => {
                        onOpen(project.projectId);
                      }}
                      type="button"
                    >
                      Abrir
                    </button>

                    <button
                      aria-label={`Duplicar ${title}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => {
                        onDuplicate(project.projectId);
                      }}
                      type="button"
                    >
                      Duplicar
                    </button>

                    <button
                      aria-label={`Eliminar ${title}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 bg-background px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                      onClick={() => {
                        onDelete(project.projectId);
                      }}
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
