import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  it('displays the official product identity and closing statement', () => {
    render(<SiteFooter />);

    expect(screen.getByRole('img', { name: 'Envelia Studio' })).toBeInTheDocument();
    expect(
      screen.getByText('Diseño que convierte momentos en recuerdos eternos.'),
    ).toBeInTheDocument();
  });

  it('presents primary public destinations in order', () => {
    render(<SiteFooter />);
    const navigation = screen.getByRole('navigation', {
      name: 'Navegación pública del pie de página',
    });

    expect(
      within(navigation)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Inicio', 'Plantillas', 'Cómo funciona', 'Precios', 'Inspiración']);
  });

  it('keeps help and contact separate from primary navigation', () => {
    render(<SiteFooter />);
    const supportNavigation = screen.getByRole('navigation', { name: 'Ayuda y contacto' });

    expect(within(supportNavigation).getByRole('link', { name: 'Ayuda' })).toHaveAttribute(
      'href',
      '/ayuda',
    );
    expect(within(supportNavigation).getByRole('link', { name: 'Contacto' })).toHaveAttribute(
      'href',
      '/contacto',
    );
    expect(within(supportNavigation).queryByRole('link', { name: 'Crear cuenta' })).toBeNull();
  });
  it('exposes the confirmed social profiles as accessible links', () => {
    render(<SiteFooter />);
    const social = screen.getByRole('navigation', { name: 'Redes sociales' });
    for (const name of ['Instagram', 'Pinterest', 'Facebook']) {
      expect(within(social).getByRole('link', { name })).toHaveAttribute('target', '_blank');
      expect(within(social).getByRole('link', { name })).toHaveAttribute(
        'rel',
        'noopener noreferrer',
      );
    }
  });
});
