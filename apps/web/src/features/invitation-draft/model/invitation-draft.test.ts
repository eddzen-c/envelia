import { describe, expect, it } from 'vitest';

import {
  createInitialInvitationDraft,
  createInvitationPreview,
  formatInvitationDate,
  initialInvitationDraft,
  invitationDraftLimits,
  invitationPreviewFallbacks,
  invitationThemeIds,
  invitationThemes,
  isInvitationThemeId,
  type InvitationDraft,
} from './invitation-draft';

describe('invitation draft model', () => {
  it('defines the supported themes in a stable order', () => {
    expect(invitationThemeIds).toEqual(['lavender', 'champagne', 'midnight']);

    expect(invitationThemes.map(({ id }) => id)).toEqual(invitationThemeIds);

    expect(new Set(invitationThemeIds).size).toBe(3);
  });

  it('defines explicit limits for editable text', () => {
    expect(invitationDraftLimits).toEqual({
      eventTitle: 80,
      location: 120,
      message: 280,
    });
  });

  it('creates independent copies of the initial draft', () => {
    const firstDraft = createInitialInvitationDraft();
    const secondDraft = createInitialInvitationDraft();

    expect(firstDraft).toEqual(initialInvitationDraft);
    expect(secondDraft).toEqual(initialInvitationDraft);

    expect(firstDraft).not.toBe(initialInvitationDraft);
    expect(secondDraft).not.toBe(initialInvitationDraft);
    expect(firstDraft).not.toBe(secondDraft);
  });

  it('recognizes only supported theme identifiers', () => {
    expect(isInvitationThemeId('lavender')).toBe(true);
    expect(isInvitationThemeId('champagne')).toBe(true);
    expect(isInvitationThemeId('midnight')).toBe(true);

    expect(isInvitationThemeId('sunset')).toBe(false);
    expect(isInvitationThemeId('')).toBe(false);
  });

  it('formats a valid calendar date in Spanish using the defined time zone', () => {
    expect(formatInvitationDate('2026-10-18')).toBe('18 de octubre de 2026');
  });

  it('uses the date fallback for empty, malformed, or impossible dates', () => {
    const invalidDates = ['', '18/10/2026', '2026-02-30', 'not-a-date'];

    for (const invalidDate of invalidDates) {
      expect(formatInvitationDate(invalidDate)).toBe(invitationPreviewFallbacks.eventDate);
    }
  });

  it('normalizes surrounding whitespace when creating a preview', () => {
    const draft: InvitationDraft = {
      eventTitle: '  Gala de aniversario  ',
      eventDate: '2027-05-09',
      location: '  Salón Magnolia  ',
      message: '  Celebremos juntos este momento.  ',
      theme: 'champagne',
    };

    expect(createInvitationPreview(draft)).toEqual({
      eventTitle: 'Gala de aniversario',
      eventDate: '9 de mayo de 2027',
      location: 'Salón Magnolia',
      message: 'Celebremos juntos este momento.',
      theme: 'champagne',
    });
  });

  it('keeps the preview meaningful when editable values are blank', () => {
    const draft: InvitationDraft = {
      eventTitle: '   ',
      eventDate: '',
      location: '\n',
      message: '\t',
      theme: 'midnight',
    };

    expect(createInvitationPreview(draft)).toEqual({
      eventTitle: invitationPreviewFallbacks.eventTitle,
      eventDate: invitationPreviewFallbacks.eventDate,
      location: invitationPreviewFallbacks.location,
      message: invitationPreviewFallbacks.message,
      theme: 'midnight',
    });
  });
});
