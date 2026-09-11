import type { FormEvent } from 'react';

import {
  invitationDraftLimits,
  invitationThemes,
  isInvitationThemeId,
  type InvitationDraft,
} from '../model/invitation-draft';

type InvitationDraftFormProps = Readonly<{
  draft: InvitationDraft;
  onDraftChange: (draft: InvitationDraft) => void;
  onReset: () => void;
}>;

const fieldClassName =
  'mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none placeholder:text-muted focus-visible:border-primary';

export function InvitationDraftForm({ draft, onDraftChange, onReset }: InvitationDraftFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      aria-labelledby="invitation-form-title"
      className="rounded-[2rem] border border-border bg-surface p-5 shadow-soft sm:p-7"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="text-sm font-bold tracking-[0.18em] text-primary uppercase">
          Personalización
        </p>

        <h2
          className="mt-2 font-display text-3xl font-semibold text-foreground"
          id="invitation-form-title"
        >
          Diseña tu borrador
        </h2>

        <p className="mt-3 leading-7 text-muted">
          Ajusta los datos principales y observa los cambios al instante.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="event-title">
            Título del evento
          </label>

          <input
            aria-describedby="event-title-description event-title-counter"
            className={fieldClassName}
            id="event-title"
            maxLength={invitationDraftLimits.eventTitle}
            onChange={(event) => {
              onDraftChange({
                ...draft,
                eventTitle: event.currentTarget.value,
              });
            }}
            type="text"
            value={draft.eventTitle}
          />

          <div className="mt-2 flex justify-between gap-4 text-xs text-muted">
            <p id="event-title-description">El nombre principal de la celebración.</p>
            <p id="event-title-counter">
              {draft.eventTitle.length}/{invitationDraftLimits.eventTitle}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="event-date">
            Fecha del evento
          </label>

          <input
            className={fieldClassName}
            id="event-date"
            onChange={(event) => {
              onDraftChange({
                ...draft,
                eventDate: event.currentTarget.value,
              });
            }}
            type="date"
            value={draft.eventDate}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="event-location">
            Lugar
          </label>

          <input
            aria-describedby="event-location-description event-location-counter"
            className={fieldClassName}
            id="event-location"
            maxLength={invitationDraftLimits.location}
            onChange={(event) => {
              onDraftChange({
                ...draft,
                location: event.currentTarget.value,
              });
            }}
            type="text"
            value={draft.location}
          />

          <div className="mt-2 flex justify-between gap-4 text-xs text-muted">
            <p id="event-location-description">La sede o ubicación de la celebración.</p>
            <p id="event-location-counter">
              {draft.location.length}/{invitationDraftLimits.location}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="event-message">
            Mensaje
          </label>

          <textarea
            aria-describedby="event-message-description event-message-counter"
            className={`${fieldClassName} min-h-32 resize-y`}
            id="event-message"
            maxLength={invitationDraftLimits.message}
            onChange={(event) => {
              onDraftChange({
                ...draft,
                message: event.currentTarget.value,
              });
            }}
            value={draft.message}
          />

          <div className="mt-2 flex justify-between gap-4 text-xs text-muted">
            <p id="event-message-description">Una invitación breve para tus asistentes.</p>
            <p id="event-message-counter">
              {draft.message.length}/{invitationDraftLimits.message}
            </p>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-foreground">Estilo visual</legend>

          <p className="mt-1 text-xs leading-5 text-muted" id="theme-description">
            Selecciona una composición con contraste accesible.
          </p>

          <div className="mt-3 grid gap-3">
            {invitationThemes.map((theme) => (
              <label
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4"
                key={theme.id}
              >
                <input
                  aria-describedby={[
                    'theme-description',
                    `invitation-theme-${theme.id}-description`,
                  ].join(' ')}
                  aria-label={theme.label}

                  checked={draft.theme === theme.id}
                  className="mt-1 size-4 shrink-0 accent-primary"
                  name="invitation-theme"
                  onChange={(event) => {
                    const { value } = event.currentTarget;

                    if (!isInvitationThemeId(value)) {
                      return;
                    }

                    onDraftChange({
                      ...draft,
                      theme: value,
                    });
                  }}
                  type="radio"
                  value={theme.id}
                />

                <span>
                  <span className="block font-semibold text-foreground">{theme.label}</span>
                  <span
                    className="mt-1 block text-sm leading-6 text-muted"
                    id={`invitation-theme-${theme.id}-description`}
                  >
                    {' '}
                    {theme.description}{' '}
                  </span>
                  {theme.description}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <button
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:border-brand-300 hover:bg-brand-50"
        onClick={onReset}
        type="button"
      >
        Restablecer ejemplo
      </button>
    </form>
  );
}
