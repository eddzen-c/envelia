import type { CSSProperties } from 'react';

import {
  invitationThemes,
  type InvitationPreview,
  type InvitationThemeId,
} from '../model/invitation-draft';
import { invitationPreviewPalettes } from './invitation-preview-palettes';

type InvitationPreviewCardProps = Readonly<{
  preview: InvitationPreview;
  presentation?: 'preview' | 'shared';
}>;

type InvitationPreviewStyle = CSSProperties &
  Readonly<{
    '--preview-surface': string;
    '--preview-foreground': string;
    '--preview-muted': string;
    '--preview-accent': string;
    '--preview-border': string;
  }>;

const createPreviewStyle = (theme: InvitationThemeId): InvitationPreviewStyle => {
  const palette = invitationPreviewPalettes[theme];

  return {
    '--preview-surface': palette.surface,
    '--preview-foreground': palette.foreground,
    '--preview-muted': palette.muted,
    '--preview-accent': palette.accent,
    '--preview-border': palette.border,
  };
};

export function InvitationPreviewCard({
  preview,
  presentation = 'preview',
}: InvitationPreviewCardProps) {
  const theme = invitationThemes.find(({ id }) => id === preview.theme) ?? invitationThemes[0];

  const isSharedInvitation = presentation === 'shared';

  return (
    <article
      aria-label={isSharedInvitation ? 'Invitación compartida' : 'Vista previa de la invitación'}
      className="rounded-[2rem] border border-[var(--preview-border)] bg-[var(--preview-surface)] p-4 text-[var(--preview-foreground)] shadow-soft sm:p-6"
      data-presentation={presentation}
      data-theme={preview.theme}
      style={createPreviewStyle(preview.theme)}
    >
      <div className="flex items-center justify-between gap-4 px-2 pb-4 text-xs font-bold tracking-[0.16em] uppercase">
        <p className="text-[var(--preview-accent)]">
          {isSharedInvitation ? 'Invitación' : 'Vista previa'}
        </p>

        <p className="text-right text-[var(--preview-muted)]">
          <span className="sr-only">Estilo seleccionado: </span>
          {theme.label}
        </p>
      </div>

      <div className="flex min-h-[32rem] flex-col items-center justify-center rounded-[1.5rem] border border-[var(--preview-border)] px-6 py-10 text-center sm:min-h-[36rem] sm:px-10">
        <p className="text-sm font-bold tracking-[0.16em] text-[var(--preview-accent)] uppercase">
          {preview.eventDate}
        </p>

        <h2 className="mt-7 max-w-full break-words font-display text-4xl leading-tight font-semibold sm:text-5xl">
          {preview.eventTitle}
        </h2>

        <div aria-hidden="true" className="my-8 h-px w-20 bg-[var(--preview-accent)]" />

        <p className="max-w-full break-words text-sm font-semibold tracking-[0.08em] text-[var(--preview-muted)] uppercase">
          {preview.location}
        </p>

        <p className="mt-7 max-w-md whitespace-pre-line break-words leading-7 text-[var(--preview-muted)]">
          {preview.message}
        </p>

        <p className="mt-12 text-xs font-bold tracking-[0.18em] text-[var(--preview-accent)] uppercase">
          Creada con Envelia Studio
        </p>
      </div>
    </article>
  );
}
