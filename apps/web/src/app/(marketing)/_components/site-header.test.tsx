import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  it('provides an accessible link to the home page', () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole('link', {
        name: 'Envelia Studio, página de inicio',
      }),
    ).toHaveAttribute('href', '/');
  });

  it('exposes the account access navigation', () => {
    render(<SiteHeader />);

    const accountNavigation = screen.getByRole('navigation', {
      name: 'Acceso a tu cuenta',
    });

    expect(
      within(accountNavigation).getByRole('link', {
        name: 'Iniciar sesión',
      }),
    ).toHaveAttribute('href', '/iniciar-sesion');

    expect(
      within(accountNavigation).getByRole('link', {
        name: 'Crear cuenta',
      }),
    ).toHaveAttribute('href', '/crear-cuenta');
  });

  it('does not bypass authentication from the public header', () => {
    render(<SiteHeader />);

    expect(
      screen.queryByRole('link', {
        name: 'Abrir Studio',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', {
        name: 'Crear mi invitación',
      }),
    ).not.toBeInTheDocument();
  });
});
