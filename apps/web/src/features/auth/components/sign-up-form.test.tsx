import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { refresh, replace, signUpWithEmail } = vi.hoisted(() => ({
  refresh: vi.fn(),
  replace: vi.fn(),
  signUpWithEmail: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh,
    replace,
  }),
}));

vi.mock('../model/auth-client', () => ({
  signUp: {
    email: signUpWithEmail,
  },
}));

import { SignUpForm } from './sign-up-form';

const completeForm = async (
  password = 'una-contrasena-segura',
  passwordConfirmation = password,
) => {
  const user = userEvent.setup();

  await user.type(
    screen.getByRole('textbox', {
      name: 'Nombre',
    }),
    'Nezquiik',
  );

  await user.type(
    screen.getByRole('textbox', {
      name: 'Correo electrónico',
    }),
    'nezquiik@example.com',
  );

  await user.type(screen.getByLabelText('Contraseña'), password);

  await user.type(screen.getByLabelText('Confirmar contraseña'), passwordConfirmation);

  await user.click(
    screen.getByRole('button', {
      name: 'Crear cuenta',
    }),
  );
};

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates an account and opens the studio', async () => {
    signUpWithEmail.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
        },
      },
      error: null,
    });

    render(<SignUpForm />);

    await completeForm();

    await waitFor(() => {
      expect(signUpWithEmail).toHaveBeenCalledWith({
        name: 'Nezquiik',
        email: 'nezquiik@example.com',
        password: 'una-contrasena-segura',
      });
    });

    expect(replace).toHaveBeenCalledWith('/studio');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('rejects different passwords before requesting registration', async () => {
    render(<SignUpForm />);

    await completeForm('una-contrasena-segura', 'otra-contrasena-segura');

    expect(await screen.findByText('Las contraseñas no coinciden.')).toHaveAttribute(
      'role',
      'alert',
    );

    expect(signUpWithEmail).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it('keeps the form available when registration fails', async () => {
    signUpWithEmail.mockResolvedValue({
      data: null,
      error: {
        message: 'USER_ALREADY_EXISTS',
      },
    });

    render(<SignUpForm />);

    await completeForm();

    expect(
      await screen.findByText('No pudimos crear tu cuenta. Revisa los datos e inténtalo de nuevo.'),
    ).toHaveAttribute('role', 'alert');

    expect(replace).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();

    expect(
      screen.getByRole('button', {
        name: 'Crear cuenta',
      }),
    ).toBeEnabled();
  });
});
