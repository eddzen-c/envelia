import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { type InvitationPreview, invitationThemes } from '../model/invitation-draft';
import { InvitationPreviewCard } from './invitation-preview-card';
import { invitationPreviewPalettes } from './invitation-preview-palettes';

const preview: InvitationPreview = {
  eventTitle: 'Gala de aniversario',
  eventDate: '9 de mayo de 2027',
  location: 'Salón Magnolia',
  message: 'Celebremos juntos este momento.',
  theme: 'champagne',
};

const hexColorPattern = /^#[0-9a-f]{6}$/iu;

const getRelativeLuminance = (hexColor: string) => {
  if (!hexColorPattern.test(hexColor)) {
    throw new Error(`Invalid hexadecimal color: ${hexColor}`);
  }

  const colorValue = Number.parseInt(hexColor.slice(1), 16);

  const channels = [(colorValue >> 16) & 255, (colorValue >> 8) & 255, colorValue & 255].map(
    (channel) => {
      const normalizedChannel = channel / 255;

      return normalizedChannel <= 0.04045
        ? normalizedChannel / 12.92
        : ((normalizedChannel + 0.055) / 1.055) ** 2.4;
    },
  );

  const [red = 0, green = 0, blue = 0] = channels;

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
};

const getContrastRatio = (firstColor: string, secondColor: string) => {
  const firstLuminance = getRelativeLuminance(firstColor);
  const secondLuminance = getRelativeLuminance(secondColor);
  const lighterLuminance = Math.max(firstLuminance, secondLuminance);
  const darkerLuminance = Math.min(firstLuminance, secondLuminance);

  return (lighterLuminance + 0.05) / (darkerLuminance + 0.05);
};

describe('InvitationPreviewCard', () => {
  it('renders the invitation as an accessible article', () => {
    render(<InvitationPreviewCard preview={preview} />);

    const article = screen.getByRole('article', {
      name: 'Vista previa de la invitación',
    });

    expect(article).toBeVisible();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: preview.eventTitle,
      }),
    ).toBeVisible();

    expect(screen.getByText(preview.eventDate)).toBeVisible();
    expect(screen.getByText(preview.location)).toBeVisible();
    expect(screen.getByText(preview.message)).toBeVisible();
    expect(screen.getByText('Creada con Envelia Studio')).toBeVisible();
  });

  it('communicates every selected theme programmatically and visibly', () => {
    const { rerender } = render(<InvitationPreviewCard preview={preview} />);

    for (const theme of invitationThemes) {
      rerender(
        <InvitationPreviewCard
          preview={{
            ...preview,
            theme: theme.id,
          }}
        />,
      );

      expect(
        screen.getByRole('article', {
          name: 'Vista previa de la invitación',
        }),
      ).toHaveAttribute('data-theme', theme.id);

      expect(screen.getByText(theme.label)).toBeInTheDocument();
    }
  });
});

describe('invitation preview palettes', () => {
  it('uses complete six-digit hexadecimal color values', () => {
    for (const palette of Object.values(invitationPreviewPalettes)) {
      for (const color of Object.values(palette)) {
        expect(color).toMatch(hexColorPattern);
      }
    }
  });

  it('maintains text contrast of at least 4.5 to 1 in every theme', () => {
    for (const palette of Object.values(invitationPreviewPalettes)) {
      const textColors = [palette.foreground, palette.muted, palette.accent];

      for (const textColor of textColors) {
        expect(getContrastRatio(textColor, palette.surface)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
