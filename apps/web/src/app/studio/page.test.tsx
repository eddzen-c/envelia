import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import StudioPage, { metadata } from './page';

describe('StudioPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('defines metadata for the invitation library', () => {
    expect(metadata).toMatchObject({
      title: 'Mis invitaciones | Envelia Studio',
      description:
        'Crea, organiza y continúa editando tus invitaciones digitales desde Envelia Studio.',
    });
  });

  it('renders the server page around the client project library', async () => {
    render(<StudioPage />);

    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');

    expect(
      screen.getByRole('link', {
        name: 'Volver a la página de inicio de Envelia Studio',
      }),
    ).toHaveAttribute('href', '/');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Crea y organiza invitaciones que se sienten tuyas',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('region', {
        name: 'Biblioteca y editor de invitaciones',
      }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', {
        name: 'Mis invitaciones',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Nueva invitación',
      }),
    ).toBeInTheDocument();
  });
});
