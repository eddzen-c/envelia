import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PricingPage, { metadata } from './page';

describe('PricingPage', () => {
  it('defines metadata for the public pricing experience', () => {
    expect(metadata.title).toBe('Precios | Envelia Studio');
    expect(metadata.description).toContain('planes de Envelia Studio');
  });

  it('presents the reference pricing hero', () => {
    render(<PricingPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /invitaciones tan especiales como tu historia/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/planes que celebran lo extraordinario/i)).toBeInTheDocument();
    expect(screen.getByText(/diseños exclusivos/i)).toBeInTheDocument();
    expect(screen.getByText(/fácil y rápido/i)).toBeInTheDocument();
    expect(screen.getByText(/resultados profesionales/i)).toBeInTheDocument();
  });

  it('uses the supplied image as one clear continuous background', () => {
    render(<PricingPage />);

    const background = screen.getByTestId('pricing-background');

    expect(decodeURIComponent(background.getAttribute('src') ?? '')).toContain(
      '/assets/envelia/pricing/background.webp',
    );
    expect(
      screen.queryByAltText('Invitación floral de boda junto a un sobre borgoña'),
    ).not.toBeInTheDocument();
  });

  it('offers the three complete plans', () => {
    render(<PricingPage />);

    const plans = screen.getByRole('region', { name: 'Planes disponibles' });

    expect(within(plans).getByRole('heading', { name: 'Básico' })).toBeInTheDocument();
    expect(within(plans).getByRole('heading', { name: 'Premium' })).toBeInTheDocument();
    expect(within(plans).getByRole('heading', { name: 'Pro' })).toBeInTheDocument();
    expect(within(plans).getByText(/\$19/)).toBeInTheDocument();
    expect(within(plans).getByText(/\$39/)).toBeInTheDocument();
    expect(within(plans).getByText(/\$59/)).toBeInTheDocument();
    expect(within(plans).getByText('Más popular')).toBeInTheDocument();
  });

  it('uses the supplied artwork for all three pricing cards', () => {
    render(<PricingPage />);

    const artworkSources = screen
      .getAllByTestId('pricing-card-artwork')
      .map((image) => decodeURIComponent(image.getAttribute('src') ?? ''));

    expect(artworkSources).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/assets/envelia/pricing/cards/basic-original-full.webp'),
        expect.stringContaining('/assets/envelia/pricing/cards/premium-original-full.webp'),
        expect.stringContaining('/assets/envelia/pricing/cards/pro-original-full.webp'),
      ]),
    );
  });

  it('links every plan to account creation', () => {
    render(<PricingPage />);

    expect(screen.getByRole('link', { name: /comenzar ahora/i })).toHaveAttribute(
      'href',
      '/crear-cuenta?plan=basico',
    );
    expect(screen.getByRole('link', { name: /elegir premium/i })).toHaveAttribute(
      'href',
      '/crear-cuenta?plan=premium',
    );
    expect(screen.getByRole('link', { name: /elegir pro/i })).toHaveAttribute(
      'href',
      '/crear-cuenta?plan=pro',
    );
  });

  it('presents the closing value statement', () => {
    render(<PricingPage />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /diseño que convierte momentos en recuerdos eternos/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Sin límites de tiempo')).toBeInTheDocument();
    expect(screen.getByText('Diseño adaptable')).toBeInTheDocument();
    expect(screen.getByText('Pagos seguros')).toBeInTheDocument();
    expect(screen.getByText('Momentos reales')).toBeInTheDocument();
  });
});
