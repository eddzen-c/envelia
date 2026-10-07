import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import HelpPage, { metadata } from './page';

describe('HelpPage', () => {
  it('presents the help experience and six questions', () => {
    render(<HelpPage />);
    expect(metadata.title).toBe('Ayuda | Envelia Studio');
    expect(screen.getByRole('heading', { level: 1, name: 'Ayuda' })).toBeInTheDocument();
    expect(document.querySelectorAll('details')).toHaveLength(6);
    expect(screen.getByRole('navigation', { name: 'Categorías de ayuda' })).toBeInTheDocument();
  });
  it('filters questions by category and restores all questions', async () => {
    const user = userEvent.setup();
    render(<HelpPage />);
    await user.click(screen.getByRole('button', { name: /pagos y planes/i }));
    expect(document.querySelectorAll('details')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Ver todas' }));
    expect(document.querySelectorAll('details')).toHaveLength(6);
  });
  it('searches without accents and provides recovery for no results', async () => {
    const user = userEvent.setup();
    render(<HelpPage />);
    const field = screen.getByRole('searchbox');
    await user.type(field, 'ubicacioninexistente');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByText(/no encontramos una respuesta/i)).toBeInTheDocument();
    await user.clear(field);
    await user.type(field, 'invitacion');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.queryByText(/no encontramos una respuesta/i)).not.toBeInTheDocument();
  });
});
