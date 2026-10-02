import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../features/auth/components/sign-up-form', () => ({
  SignUpForm: () => (
    <form aria-label="Formulario para crear una cuenta">
      <label htmlFor="page-test-name">Nombre</label>
      <input id="page-test-name" type="text" />
    </form>
  ),
}));

import SignUpPage, { metadata } from './page';

describe('SignUpPage', () => {
  it('defines the account creation metadata', () => {
    expect(metadata).toMatchObject({
      title: 'Crear cuenta | Envelia',
      description:
        'Crea tu cuenta de Envelia para diseñar, organizar y conservar todas tus invitaciones.',
    });
  });

  it('presents the Envelia account creation experience', () => {
    render(<SignUpPage />);

    expect(screen.getByRole('main')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Crea invitaciones que se sientan realmente tuyas',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('form', {
        name: 'Formulario para crear una cuenta',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: 'Iniciar sesión',
      }),
    ).toHaveAttribute('href', '/iniciar-sesion');

    expect(
      screen.getByRole('link', {
        name: 'Volver a la página de inicio de Envelia Studio',
      }),
    ).toHaveAttribute('href', '/');
  });
});
