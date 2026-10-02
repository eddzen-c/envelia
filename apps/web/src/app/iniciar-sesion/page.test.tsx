import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../features/auth/components/sign-in-form', () => ({
  SignInForm: () => (
    <form aria-label="Formulario de inicio de sesión">
      <label htmlFor="page-test-email">Correo electrónico</label>
      <input id="page-test-email" type="email" />
    </form>
  ),
}));

import SignInPage, { metadata } from './page';

describe('SignInPage', () => {
  it('defines the authentication metadata', () => {
    expect(metadata).toMatchObject({
      title: 'Iniciar sesión | Envelia',
      description:
        'Accede a Envelia para continuar creando, organizando y compartiendo tus invitaciones.',
    });
  });

  it('presents the Envelia sign-in experience', () => {
    render(<SignInPage />);

    expect(screen.getByRole('main')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Continúa creando momentos inolvidables',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('form', {
        name: 'Formulario de inicio de sesión',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: 'Crear cuenta',
      }),
    ).toHaveAttribute('href', '/crear-cuenta');

    expect(
      screen.getByRole('link', {
        name: 'Volver a la página de inicio de Envelia Studio',
      }),
    ).toHaveAttribute('href', '/');
  });
});
