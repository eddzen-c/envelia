import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from './page';

describe('HomePage', () => {
  it('exposes the principal content with accessible section names', () => {
    render(<HomePage />);

    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Invitaciones digitales que cobran vida\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('region', {
        name: /Invitaciones digitales que cobran vida\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('region', {
        name: 'De la idea a tus invitados',
      }),
    ).toBeInTheDocument();
  });

  it('links both calls to action to their corresponding page sections', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('link', {
        name: 'Descubrir la experiencia',
      }),
    ).toHaveAttribute('href', '#experiencia');

    expect(
      screen.getByRole('link', {
        name: 'Ver muestra conceptual',
      }),
    ).toHaveAttribute('href', '#muestra');
  });

  it('presents the experience steps in their intended order', () => {
    render(<HomePage />);

    const experienceList = screen.getByRole('list');
    const items = within(experienceList).getAllByRole('listitem');
    const headings = within(experienceList).getAllByRole('heading', {
      level: 3,
    });

    expect(items).toHaveLength(3);
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Elige',
      'Personaliza',
      'Comparte',
    ]);
  });
});
