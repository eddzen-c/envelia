import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(() => '/'),
}));

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}));

import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue('/');
  });

  it('provides the official brand link to the home page', () => {
    render(<SiteHeader />);
    const homeLink = screen.getByRole('link', {
      name: 'Envelia Studio, página de inicio',
    });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(within(homeLink).getByRole('img', { name: 'Envelia Studio' })).toBeInTheDocument();
  });

  it('presents the five primary public destinations in order', () => {
    render(<SiteHeader />);
    const navigation = screen.getByRole('navigation', { name: 'Navegación principal' });

    expect(
      within(navigation)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Inicio', 'Plantillas', 'Cómo funciona', 'Precios', 'Inspiración']);
    expect(within(navigation).getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('identifies the active public destination', () => {
    usePathnameMock.mockReturnValue('/plantillas');
    render(<SiteHeader />);
    const navigation = screen.getByRole('navigation', { name: 'Navegación principal' });

    expect(within(navigation).getByRole('link', { name: 'Plantillas' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(navigation).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('sends unauthenticated visitors through account access', () => {
    render(<SiteHeader />);
    const accountNavigation = screen.getByRole('navigation', { name: 'Acceso a tu cuenta' });

    expect(within(accountNavigation).getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute(
      'href',
      '/iniciar-sesion',
    );
    expect(
      within(accountNavigation).getByRole('link', { name: 'Crear invitación' }),
    ).toHaveAttribute('href', '/crear-cuenta');
    expect(screen.queryByRole('link', { name: 'Abrir Studio' })).not.toBeInTheDocument();
  });
});
