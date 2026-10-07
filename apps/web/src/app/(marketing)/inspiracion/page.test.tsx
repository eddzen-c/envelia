import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import InspirationPage, { metadata } from './page';

describe('InspirationPage', () => {
  it('defines metadata for the public inspiration experience', () => {
    expect(metadata.title).toBe('Inspiración | Envelia Studio');
    expect(metadata.description).toContain('ideas, colores, estilos y detalles');
  });

  it('presents the reference hero and its two paths', () => {
    render(<InspirationPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /ideas que hacen momentos inolvidables/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/cada celebración en una historia única/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explorar ideas/i })).toHaveAttribute(
      'href',
      '#ocasiones',
    );
    expect(screen.getByRole('link', { name: /ver plantillas/i })).toHaveAttribute(
      'href',
      '/plantillas',
    );
  });

  it('uses the two supplied images for the hero and lower sections', () => {
    render(<InspirationPage />);

    expect(
      decodeURIComponent(
        screen.getByTestId('inspiration-hero-background').getAttribute('src') ?? '',
      ),
    ).toContain('/assets/envelia/inspiration/hero-reference.webp');
    expect(
      decodeURIComponent(
        screen.getByTestId('inspiration-section-background').getAttribute('src') ?? '',
      ),
    ).toContain('/assets/envelia/inspiration/lower-reference.webp');
  });

  it('presents inspiration for the four stages shown in the reference', () => {
    render(<InspirationPage />);
    const occasions = screen.getByRole('region', {
      name: 'Celebra cada etapa de la vida',
    });

    expect(
      within(occasions)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Bodas', 'XV años', 'Baby Shower', 'Eventos especiales']);
  });

  it('presents the five editorial inspiration themes', () => {
    render(<InspirationPage />);
    const ideas = screen.getByRole('region', {
      name: /tendencias, estilos y detalles que enamoran/i,
    });

    expect(
      within(ideas)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      'Paletas de color',
      'Tipografías elegantes',
      'Decoración y ambientación',
      'Detalles y complementos',
      'Eventos reales',
    ]);
    expect(
      screen.getByText('La inspiración de hoy puede ser el inicio de tu mejor historia.'),
    ).toBeInTheDocument();
  });
});
