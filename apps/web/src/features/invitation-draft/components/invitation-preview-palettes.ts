import type { InvitationThemeId } from '../model/invitation-draft';

export type InvitationPreviewPalette = Readonly<{
  surface: string;
  foreground: string;
  muted: string;
  accent: string;
  border: string;
}>;

export const invitationPreviewPalettes = {
  lavender: {
    surface: '#fbf8ff',
    foreground: '#24143d',
    muted: '#594d66',
    accent: '#6f35c5',
    border: '#d8c6f0',
  },
  champagne: {
    surface: '#fffaf0',
    foreground: '#2c2112',
    muted: '#5f5445',
    accent: '#79572d',
    border: '#dcc89f',
  },
  midnight: {
    surface: '#182033',
    foreground: '#fffdf8',
    muted: '#d6d0c4',
    accent: '#e6c98f',
    border: '#536079',
  },
} as const satisfies Record<InvitationThemeId, InvitationPreviewPalette>;
