import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { refresh, replace, signInWithEmail } = vi.hoisted(() => ({
  refresh: vi.fn(),
  replace: vi.fn(),
  signInWithEmail: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh,
    replace,
  }),
}));

vi.mock('../model/auth-client', () => ({
  signIn: {
    email: signInWithEmail,
  },
}));

import { SignInForm } from './sign-in-form';

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('authenticates with email and opens the studio', async () => {
    const user = userEvent.setup();

    signInWithEmail.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
        },
      },
      error: null,
    });

    render(<SignInForm />);

    await user.type(
      screen.getByRole('textbox', {
        name: 'Correo electrónico',
      }),
      'nezquiik@example.com',
    );

    await user.type(screen.getByLabelText('Contraseña'), 'una-contrasena-segura');

    await user.click(
      screen.getByRole('button', {
        name: 'Iniciar sesión',
      }),
    );

    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith({
        email: 'nezquiik@example.com',
        password: 'una-contrasena-segura',
        rememberMe: true,
      });
    });

    expect(replace).toHaveBeenCalledWith('/studio');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps the form available when authentication fails', async () => {
    const user = userEvent.setup();

    signInWithEmail.mockResolvedValue({
      data: null,
      error: {
        message: 'INVALID_EMAIL_OR_PASSWORD',
      },
    });

    render(<SignInForm />);

    await user.type(
      screen.getByRole('textbox', {
        name: 'Correo electrónico',
      }),
      'nezquiik@example.com',
    );

    await user.type(screen.getByLabelText('Contraseña'), 'contrasena-incorrecta');

    await user.click(
      screen.getByRole('checkbox', {
        name: 'Mantener mi sesión iniciada',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Iniciar sesión',
      }),
    );

    expect(
      await screen.findByText(
        'No pudimos iniciar sesión. Verifica tu correo y contraseña e inténtalo de nuevo.',
      ),
    ).toHaveAttribute('role', 'alert');

    expect(signInWithEmail).toHaveBeenCalledWith({
      email: 'nezquiik@example.com',
      password: 'contrasena-incorrecta',
      rememberMe: false,
    });

    expect(replace).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();

    expect(
      screen.getByRole('button', {
        name: 'Iniciar sesión',
      }),
    ).toBeEnabled();
  });
});
