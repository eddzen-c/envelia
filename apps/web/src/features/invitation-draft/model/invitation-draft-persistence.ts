import {
  initialInvitationDraft,
  invitationDraftLimits,
  isInvitationThemeId,
  type InvitationDraft,
} from './invitation-draft';

export const invitationDraftStorageVersion = 1 as const;

export const invitationDraftStorageKey = 'envelia.invitation-draft.v1';

export type InvitationDraftStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type InvitationDraftLoadResult =
  | Readonly<{
      status: 'empty' | 'discarded' | 'unavailable';
      draft: null;
    }>
  | Readonly<{
      status: 'restored';
      draft: InvitationDraft;
    }>;

export type InvitationDraftSaveResult = 'saved' | 'cleared' | 'unavailable';

type UnknownRecord = Record<string, unknown>;

type InvitationDraftEnvelope = Readonly<{
  version: typeof invitationDraftStorageVersion;
  draft: InvitationDraft;
}>;

const invitationDraftKeys = [
  'eventTitle',
  'eventDate',
  'location',
  'message',
  'theme',
] as const satisfies readonly (keyof InvitationDraft)[];

const invitationDraftEnvelopeKeys = ['version', 'draft'] as const;

const invitationDatePattern = /^\d{4}-\d{2}-\d{2}$/u;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (value: UnknownRecord, expectedKeys: readonly string[]) => {
  const actualKeys = Object.keys(value);

  return (
    actualKeys.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
  );
};

const isSupportedDate = (value: unknown) => {
  if (typeof value !== 'string') {
    return false;
  }

  if (value.length === 0) {
    return true;
  }

  if (!invitationDatePattern.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
};

export const isInvitationDraft = (value: unknown): value is InvitationDraft => {
  if (!isRecord(value) || !hasExactKeys(value, invitationDraftKeys)) {
    return false;
  }

  return (
    typeof value.eventTitle === 'string' &&
    value.eventTitle.length <= invitationDraftLimits.eventTitle &&
    isSupportedDate(value.eventDate) &&
    typeof value.location === 'string' &&
    value.location.length <= invitationDraftLimits.location &&
    typeof value.message === 'string' &&
    value.message.length <= invitationDraftLimits.message &&
    typeof value.theme === 'string' &&
    isInvitationThemeId(value.theme)
  );
};

const isInitialInvitationDraft = (draft: InvitationDraft) =>
  invitationDraftKeys.every((key) => draft[key] === initialInvitationDraft[key]);

export const serializeInvitationDraft = (draft: InvitationDraft) => {
  const envelope: InvitationDraftEnvelope = {
    version: invitationDraftStorageVersion,
    draft: {
      eventTitle: draft.eventTitle,
      eventDate: draft.eventDate,
      location: draft.location,
      message: draft.message,
      theme: draft.theme,
    },
  };

  return JSON.stringify(envelope);
};

export const parseInvitationDraft = (serializedDraft: string): InvitationDraft | null => {
  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(serializedDraft) as unknown;
  } catch {
    return null;
  }

  if (
    !isRecord(parsedValue) ||
    !hasExactKeys(parsedValue, invitationDraftEnvelopeKeys) ||
    parsedValue.version !== invitationDraftStorageVersion ||
    !isInvitationDraft(parsedValue.draft)
  ) {
    return null;
  }

  return {
    ...parsedValue.draft,
  };
};

export const loadInvitationDraft = (storage: InvitationDraftStorage): InvitationDraftLoadResult => {
  let serializedDraft: string | null;

  try {
    serializedDraft = storage.getItem(invitationDraftStorageKey);
  } catch {
    return {
      status: 'unavailable',
      draft: null,
    };
  }

  if (serializedDraft === null) {
    return {
      status: 'empty',
      draft: null,
    };
  }

  const draft = parseInvitationDraft(serializedDraft);

  if (draft) {
    return {
      status: 'restored',
      draft,
    };
  }

  try {
    storage.removeItem(invitationDraftStorageKey);

    return {
      status: 'discarded',
      draft: null,
    };
  } catch {
    return {
      status: 'unavailable',
      draft: null,
    };
  }
};

export const persistInvitationDraft = (
  storage: InvitationDraftStorage,
  draft: InvitationDraft,
): InvitationDraftSaveResult => {
  try {
    if (isInitialInvitationDraft(draft)) {
      storage.removeItem(invitationDraftStorageKey);

      return 'cleared';
    }

    storage.setItem(invitationDraftStorageKey, serializeInvitationDraft(draft));

    return 'saved';
  } catch {
    return 'unavailable';
  }
};
