import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HowItWorksPage, { metadata } from './page';

describe('HowItWorksPage', () => {
  it('defines metadata for the public process page', () => {
    expect(metadata.title).toBe('Cómo funciona | Envelia Studio');
    expect(metadata.description).toContain('crear, personalizar y compartir');
  });

  it('presents the complete four-step Envelia process', () => {
    render(<HowItWorksPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Cómo funciona en Envelia Studio' }),
    ).toBeInTheDocument();

    const process = screen.getByRole('region', {
      name: 'Así de fácil es crear momentos inolvidables',
    });

    expect(within(process).getAllByRole('article')).toHaveLength(4);
    expect(
      within(process).getByRole('heading', { name: 'Elige tu plantilla' }),
    ).toBeInTheDocument();
    expect(
      within(process).getByRole('heading', { name: 'Personaliza los detalles' }),
    ).toBeInTheDocument();
    expect(
      within(process).getByRole('heading', { name: 'Comparte tu invitación' }),
    ).toBeInTheDocument();
    expect(
      within(process).getByRole('heading', { name: 'Gestiona tus confirmaciones' }),
    ).toBeInTheDocument();
  });

  it('exposes the two principal calls to action', () => {
    render(<HowItWorksPage />);

    expect(screen.getByRole('link', { name: /Crear mi invitación/ })).toHaveAttribute(
      'href',
      '/crear-cuenta',
    );
    expect(screen.getByRole('link', { name: 'Ver plantillas' })).toHaveAttribute(
      'href',
      '/plantillas',
    );
  });
});
