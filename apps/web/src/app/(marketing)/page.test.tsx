import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from './page';

describe('HomePage', () => {
  it('presents the premium Envelia welcome experience', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Bienvenida a Envelia Studio/u,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('figure', {
        name: 'Invitación floral premium de Envelia Studio',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', {
        name: /Diseño que convierte momentos en recuerdos eternos/u,
      }),
    ).toBeInTheDocument();
  });

  it('routes creation through authentication and exposes template discovery', () => {
    render(<HomePage />);

    expect(screen.getByRole('link', { name: /Crear invitación/u })).toHaveAttribute(
      'href',
      '/crear-cuenta',
    );
    expect(screen.getByRole('link', { name: 'Explorar plantillas' })).toHaveAttribute(
      'href',
      '/plantillas',
    );
  });

  it('presents the four product benefits in order', () => {
    render(<HomePage />);
    const benefits = screen.getByRole('list', { name: 'Beneficios de crear con Envelia' });

    expect(
      within(benefits)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([
      'Diseños exclusivosCreados para emocionar',
      'Fácil y rápidoPersonaliza en minutos',
      'Resultados profesionalesCada detalle cuidado',
      'Para todos tus momentosCelebra a tu manera',
    ]);
  });

  it('links the four visual discovery cards', () => {
    render(<HomePage />);

    expect(
      ['Plantillas', 'Cómo funciona', 'Precios', 'Inspiración'].map(
        (title) => screen.getByRole('heading', { level: 2, name: title }).textContent,
      ),
    ).toEqual(['Plantillas', 'Cómo funciona', 'Precios', 'Inspiración']);

    expect(screen.getByRole('link', { name: 'Explorar Plantillas' })).toHaveAttribute(
      'href',
      '/plantillas',
    );
  });
});
