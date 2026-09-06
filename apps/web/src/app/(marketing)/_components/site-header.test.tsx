import { render, screen } from '@testing-library/react';
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

  it('communicates the current pre-release status', () => {
    render(<SiteHeader />);

    expect(screen.getByText('Próximamente')).toBeInTheDocument();
  });
});
