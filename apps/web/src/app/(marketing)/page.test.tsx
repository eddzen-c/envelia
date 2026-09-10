import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from './page';

describe('HomePage', () => {
  it('exposes the principal content with accessible section names', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Invitaciones digitales\s+que cobran vida\./u,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('region', {
        name: /Invitaciones digitales\s+que cobran vida\./u,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('complementary', {
        name: 'Muestra conceptual de una invitación digital',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('region', {
        name: 'De la idea a tus invitados',
      }),
    ).toBeInTheDocument();
  });

  it('exposes product creation and experience discovery actions', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('link', {
        name: 'Crear mi invitación',
      }),
    ).toHaveAttribute('href', '/studio');

    expect(
      screen.getByRole('link', {
        name: 'Descubrir la experiencia',
      }),
    ).toHaveAttribute('href', '#experiencia');
  });

  it('presents the three experience steps in order', () => {
    render(<HomePage />);

    const experienceSection = screen.getByRole('region', {
      name: 'De la idea a tus invitados',
    });

    expect(
      within(experienceSection)
        .getAllByRole('heading', {
          level: 3,
        })
        .map((heading) => heading.textContent),
    ).toEqual(['Elige', 'Personaliza', 'Comparte']);
  });
});
