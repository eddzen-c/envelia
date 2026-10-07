import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TemplatesPage, { metadata } from './page';

describe('TemplatesPage', () => {
  it('defines metadata for the premium template collection', () => {
    expect(metadata.title).toBe('Plantillas digitales | Envelia Studio');
  });

  it('presents the reference hero and creation path', async () => {
    render(await TemplatesPage());

    expect(
      screen.getByRole('heading', { level: 1, name: /Diseños que cuentan tu historia/u }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Crear invitación/u })).toHaveAttribute(
      'href',
      '/crear-cuenta',
    );
  });

  it('offers the complete occasion filter in order', async () => {
    render(await TemplatesPage());
    const filters = screen.getByRole('navigation', { name: 'Filtrar plantillas por ocasión' });

    expect(
      within(filters)
        .getAllByRole('link')
        .map((link) => link.textContent?.trim()),
    ).toEqual([
      'Todos',
      'Bodas',
      'XV Años',
      'Cumpleaños',
      'Bautizos',
      'Comuniones',
      'Eventos empresariales',
      'Fechas especiales',
    ]);
  });

  it('presents the featured design and five collection cards', async () => {
    render(await TemplatesPage());

    expect(screen.getByRole('heading', { level: 2, name: 'Jardín Dorado' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Explorar plantilla/u })).toHaveLength(5);
    expect(screen.getByRole('search', { name: 'Buscar y ordenar plantillas' })).toBeInTheDocument();
  });
  it('filters the collection using the category in the URL', async () => {
    render(await TemplatesPage({ searchParams: Promise.resolve({ categoria: 'xv-anos' }) }));
    expect(screen.getAllByRole('link', { name: /Explorar plantilla/u })).toHaveLength(1);
    expect(
      screen.getByRole('link', { name: 'Explorar plantilla Rosa Eterna' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'XV Años' })).toHaveAttribute('aria-current', 'page');
  });
  it('offers recovery when a category has no designs', async () => {
    render(await TemplatesPage({ searchParams: Promise.resolve({ categoria: 'baby-shower' }) }));
    expect(screen.getByRole('status')).toHaveTextContent('No encontramos plantillas');
    expect(screen.queryByRole('link', { name: /Explorar plantilla/u })).toBeNull();
  });
});
