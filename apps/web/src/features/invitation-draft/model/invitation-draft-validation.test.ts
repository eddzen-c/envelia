import { describe, expect, it } from 'vitest';

import {
  initialInvitationDraft,
  invitationDraftLimits,
  isInvitationDraft,
} from './invitation-draft';

describe('invitation draft validation', () => {
  it('accepts a complete draft with the supported schema', () => {
    expect(
      isInvitationDraft({
        ...initialInvitationDraft,
      }),
    ).toBe(true);
  });

  it('accepts empty editable values', () => {
    expect(
      isInvitationDraft({
        eventTitle: '',
        eventDate: '',
        location: '',
        message: '',
        theme: 'champagne',
      }),
    ).toBe(true);
  });

  it('rejects partial values and unexpected fields', () => {
    expect(
      isInvitationDraft({
        eventTitle: initialInvitationDraft.eventTitle,
      }),
    ).toBe(false);

    expect(
      isInvitationDraft({
        ...initialInvitationDraft,
        unexpected: true,
      }),
    ).toBe(false);
  });

  it('rejects values with unsupported field types or themes', () => {
    expect(
      isInvitationDraft({
        ...initialInvitationDraft,
        message: 42,
      }),
    ).toBe(false);

    expect(
      isInvitationDraft({
        ...initialInvitationDraft,
        theme: 'unknown',
      }),
    ).toBe(false);
  });

  it('rejects text exceeding the supported limits', () => {
    expect(
      isInvitationDraft({
        ...initialInvitationDraft,
        eventTitle: 'a'.repeat(invitationDraftLimits.eventTitle + 1),
      }),
    ).toBe(false);

    expect(
      isInvitationDraft({
        ...initialInvitationDraft,
        location: 'a'.repeat(invitationDraftLimits.location + 1),
      }),
    ).toBe(false);

    expect(
      isInvitationDraft({
        ...initialInvitationDraft,
        message: 'a'.repeat(invitationDraftLimits.message + 1),
      }),
    ).toBe(false);
  });

  it('rejects malformed and impossible calendar dates', () => {
    expect(
      isInvitationDraft({
        ...initialInvitationDraft,
        eventDate: '16-09-2026',
      }),
    ).toBe(false);

    expect(
      isInvitationDraft({
        ...initialInvitationDraft,
        eventDate: '2026-02-30',
      }),
    ).toBe(false);
  });

  it('rejects null, arrays, and primitive values', () => {
    expect(isInvitationDraft(null)).toBe(false);
    expect(isInvitationDraft([])).toBe(false);
    expect(isInvitationDraft('draft')).toBe(false);
  });
});
