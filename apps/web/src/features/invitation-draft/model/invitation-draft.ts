export const invitationThemeIds = ['lavender', 'champagne', 'midnight'] as const;

export type InvitationThemeId = (typeof invitationThemeIds)[number];

export type InvitationTheme = Readonly<{
  id: InvitationThemeId;
  label: string;
  description: string;
}>;

export type InvitationDraft = Readonly<{
  eventTitle: string;
  eventDate: string;
  location: string;
  message: string;
  theme: InvitationThemeId;
}>;

export type InvitationPreview = Readonly<{
  eventTitle: string;
  eventDate: string;
  location: string;
  message: string;
  theme: InvitationThemeId;
}>;

export const invitationDraftLimits = {
  eventTitle: 80,
  location: 120,
  message: 280,
} as const;

export const invitationThemes = [
  {
    id: 'lavender',
    label: 'Lavanda',
    description: 'Una composición luminosa con acentos violetas.',
  },
  {
    id: 'champagne',
    label: 'Champaña',
    description: 'Una composición cálida con acentos dorados.',
  },
  {
    id: 'midnight',
    label: 'Medianoche',
    description: 'Una composición oscura con acentos luminosos.',
  },
] as const satisfies readonly InvitationTheme[];

export const invitationPreviewFallbacks = {
  eventTitle: 'Tu celebración',
  eventDate: 'Fecha por confirmar',
  location: 'Lugar por confirmar',
  message: 'Pronto compartiremos todos los detalles.',
} as const;

export const initialInvitationDraft = {
  eventTitle: 'Andrea & Mateo',
  eventDate: '2026-10-18',
  location: 'Jardín Aurora · Ciudad de México',
  message: 'Acompáñanos a celebrar una historia que apenas comienza.',
  theme: 'lavender',
} as const satisfies InvitationDraft;

const invitationDatePattern = /^\d{4}-\d{2}-\d{2}$/u;

const invitationDateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const getPreviewText = (value: string, fallback: string) => {
  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : fallback;
};

const parseInvitationDate = (value: string) => {
  if (!invitationDatePattern.test(value)) {
    return null;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== value) {
    return null;
  }

  return parsedDate;
};

export const createInitialInvitationDraft = (): InvitationDraft => ({
  ...initialInvitationDraft,
});

export const isInvitationThemeId = (value: string): value is InvitationThemeId =>
  (invitationThemeIds as readonly string[]).includes(value);

export const formatInvitationDate = (value: string) => {
  const parsedDate = parseInvitationDate(value);

  return parsedDate
    ? invitationDateFormatter.format(parsedDate)
    : invitationPreviewFallbacks.eventDate;
};

export const createInvitationPreview = (draft: InvitationDraft): InvitationPreview => ({
  eventTitle: getPreviewText(draft.eventTitle, invitationPreviewFallbacks.eventTitle),
  eventDate: formatInvitationDate(draft.eventDate),
  location: getPreviewText(draft.location, invitationPreviewFallbacks.location),
  message: getPreviewText(draft.message, invitationPreviewFallbacks.message),
  theme: draft.theme,
});
