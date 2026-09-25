import {
  initialInvitationDraft,
  invitationDraftKeys,
  isInvitationDraft,
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

const invitationDraftEnvelopeKeys = ['version', 'draft'] as const;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (value: UnknownRecord, expectedKeys: readonly string[]) => {
  const actualKeys = Object.keys(value);

  return (
    actualKeys.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
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
