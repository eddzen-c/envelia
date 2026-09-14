import { describe, expect, it, vi } from 'vitest';

import {
  initialInvitationDraft,
  invitationDraftLimits,
  type InvitationDraft,
} from './invitation-draft';
import {
  invitationDraftStorageKey,
  invitationDraftStorageVersion,
  loadInvitationDraft,
  parseInvitationDraft,
  persistInvitationDraft,
  serializeInvitationDraft,
  type InvitationDraftStorage,
} from './invitation-draft-persistence';

const customDraft: InvitationDraft = {
  eventTitle: 'Graduación de Valeria',
  eventDate: '2027-06-25',
  location: 'Jardín de los Arcos',
  message: 'Celebremos juntos el comienzo de una nueva etapa.',
  theme: 'midnight',
};

const createMemoryStorage = () => {
  const values = new Map<string, string>();

  const storage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    }),
  } satisfies InvitationDraftStorage;

  return {
    storage,
    values,
  };
};

describe('invitation draft persistence', () => {
  it('defines a stable versioned storage contract', () => {
    expect(invitationDraftStorageVersion).toBe(1);
    expect(invitationDraftStorageKey).toBe('envelia.invitation-draft.v1');
  });

  it('serializes only the supported draft fields in a versioned envelope', () => {
    expect(JSON.parse(serializeInvitationDraft(customDraft))).toEqual({
      version: 1,
      draft: customDraft,
    });
  });

  it('parses a valid draft as an independent object', () => {
    const restoredDraft = parseInvitationDraft(serializeInvitationDraft(customDraft));

    expect(restoredDraft).toEqual(customDraft);
    expect(restoredDraft).not.toBe(customDraft);
  });

  it('accepts empty editable values as a valid persisted draft', () => {
    const emptyDraft: InvitationDraft = {
      eventTitle: '',
      eventDate: '',
      location: '',
      message: '',
      theme: 'champagne',
    };

    expect(parseInvitationDraft(serializeInvitationDraft(emptyDraft))).toEqual(emptyDraft);
  });

  it('rejects malformed or incompatible persisted values', () => {
    const invalidValues = [
      '{',
      JSON.stringify(null),
      JSON.stringify({
        version: 2,
        draft: customDraft,
      }),
      JSON.stringify({
        version: 1,
        draft: {
          ...customDraft,
          theme: 'sunset',
        },
      }),
      JSON.stringify({
        version: 1,
        draft: {
          ...customDraft,
          eventTitle: 'a'.repeat(invitationDraftLimits.eventTitle + 1),
        },
      }),
      JSON.stringify({
        version: 1,
        draft: {
          ...customDraft,
          eventDate: '2027-02-30',
        },
      }),
      JSON.stringify({
        version: 1,
        draft: {
          ...customDraft,
          message: 42,
        },
      }),
      JSON.stringify({
        version: 1,
        draft: {
          ...customDraft,
          unexpected: true,
        },
      }),
    ];

    for (const invalidValue of invalidValues) {
      expect(parseInvitationDraft(invalidValue)).toBeNull();
    }
  });

  it('reports empty storage without attempting cleanup', () => {
    const { storage } = createMemoryStorage();

    expect(loadInvitationDraft(storage)).toEqual({
      status: 'empty',
      draft: null,
    });
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  it('restores a valid draft from storage', () => {
    const { storage, values } = createMemoryStorage();

    values.set(invitationDraftStorageKey, serializeInvitationDraft(customDraft));

    expect(loadInvitationDraft(storage)).toEqual({
      status: 'restored',
      draft: customDraft,
    });
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  it('discards invalid stored data', () => {
    const { storage, values } = createMemoryStorage();

    values.set(invitationDraftStorageKey, '{"version":1,"draft":null}');

    expect(loadInvitationDraft(storage)).toEqual({
      status: 'discarded',
      draft: null,
    });
    expect(storage.removeItem).toHaveBeenCalledWith(invitationDraftStorageKey);
    expect(values.has(invitationDraftStorageKey)).toBe(false);
  });

  it('reports unavailable storage when reading throws', () => {
    const storage: InvitationDraftStorage = {
      getItem: () => {
        throw new Error('Storage access denied');
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    };

    expect(loadInvitationDraft(storage)).toEqual({
      status: 'unavailable',
      draft: null,
    });
  });

  it('persists a custom draft', () => {
    const { storage, values } = createMemoryStorage();

    expect(persistInvitationDraft(storage, customDraft)).toBe('saved');
    expect(values.get(invitationDraftStorageKey)).toBe(serializeInvitationDraft(customDraft));
  });

  it('clears storage instead of persisting the initial example', () => {
    const { storage, values } = createMemoryStorage();

    values.set(invitationDraftStorageKey, serializeInvitationDraft(customDraft));

    expect(persistInvitationDraft(storage, initialInvitationDraft)).toBe('cleared');
    expect(storage.removeItem).toHaveBeenCalledWith(invitationDraftStorageKey);
    expect(values.has(invitationDraftStorageKey)).toBe(false);
  });

  it('contains write and removal failures inside the persistence boundary', () => {
    const unavailableStorage: InvitationDraftStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('Storage quota exceeded');
      },
      removeItem: () => {
        throw new Error('Storage access denied');
      },
    };

    expect(persistInvitationDraft(unavailableStorage, customDraft)).toBe('unavailable');
    expect(persistInvitationDraft(unavailableStorage, initialInvitationDraft)).toBe('unavailable');
  });
});
