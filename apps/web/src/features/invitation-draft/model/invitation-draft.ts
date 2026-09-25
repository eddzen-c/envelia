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

export const invitationDraftKeys = [
  'eventTitle',
  'eventDate',
  'location',
  'message',
  'theme',
] as const satisfies readonly (keyof InvitationDraft)[];

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

type UnknownRecord = Record<string, unknown>;

const invitationDatePattern = /^\d{4}-\d{2}-\d{2}$/u;

const invitationDateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (value: UnknownRecord, expectedKeys: readonly string[]) => {
  const actualKeys = Object.keys(value);

  return (
    actualKeys.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
  );
};

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

const isSupportedInvitationDate = (value: unknown) =>
  typeof value === 'string' && (value.length === 0 || parseInvitationDate(value) !== null);

export const createInitialInvitationDraft = (): InvitationDraft => ({
  ...initialInvitationDraft,
});

export const isInvitationThemeId = (value: string): value is InvitationThemeId =>
  (invitationThemeIds as readonly string[]).includes(value);

export const isInvitationDraft = (value: unknown): value is InvitationDraft => {
  if (!isRecord(value) || !hasExactKeys(value, invitationDraftKeys)) {
    return false;
  }

  return (
    typeof value.eventTitle === 'string' &&
    value.eventTitle.length <= invitationDraftLimits.eventTitle &&
    isSupportedInvitationDate(value.eventDate) &&
    typeof value.location === 'string' &&
    value.location.length <= invitationDraftLimits.location &&
    typeof value.message === 'string' &&
    value.message.length <= invitationDraftLimits.message &&
    typeof value.theme === 'string' &&
    isInvitationThemeId(value.theme)
  );
};

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
