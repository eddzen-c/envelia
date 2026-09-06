import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  it('displays the product identity and tagline', () => {
    render(<SiteFooter />);

    expect(screen.getByText('Envelia Studio')).toBeInTheDocument();
    expect(screen.getByText('Invitaciones que cobran vida.')).toBeInTheDocument();
  });
});
