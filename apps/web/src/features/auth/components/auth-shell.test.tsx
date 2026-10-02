import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AuthShell } from './auth-shell';

describe('AuthShell', () => {
  it('presents the authentication content and navigation accessibly', () => {
    render(
      <AuthShell
        alternateHref="/crear-cuenta"
        alternateLabel="Crear cuenta"
        alternatePrompt="¿Aún no tienes una cuenta?"
        description="Accede a tus invitaciones."
        eyebrow="Bienvenido de nuevo"
        title="Inicia sesión"
      >
        <form aria-label="Formulario de acceso">
          <button type="submit">Continuar</button>
        </form>
      </AuthShell>,
    );

    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');

    expect(
      screen.getByRole('link', {
        name: 'Volver a la página de inicio de Envelia Studio',
      }),
    ).toHaveAttribute('href', '/');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Inicia sesión',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('complementary', {
        name: 'Ventajas de tu cuenta de Envelia Studio',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: 'Crear cuenta',
      }),
    ).toHaveAttribute('href', '/crear-cuenta');

    expect(
      within(
        screen.getByRole('form', {
          name: 'Formulario de acceso',
        }),
      ).getByRole('button', {
        name: 'Continuar',
      }),
    ).toBeInTheDocument();
  });

  it('presents the three account benefits in order', () => {
    render(
      <AuthShell
        alternateHref="/iniciar-sesion"
        alternateLabel="Iniciar sesión"
        alternatePrompt="¿Ya tienes una cuenta?"
        description="Crea tu espacio personal."
        eyebrow="Comienza tu experiencia"
        title="Crea tu cuenta"
      >
        <div>Contenido del formulario</div>
      </AuthShell>,
    );

    const benefits = within(
      screen.getByRole('complementary', {
        name: 'Ventajas de tu cuenta de Envelia Studio',
      }),
    ).getAllByRole('listitem');

    expect(benefits.map((benefit) => benefit.textContent)).toEqual([
      'Conserva todas tus invitaciones en un mismo espacio.',
      'Personaliza cada celebración a tu propio ritmo.',
      'Comparte experiencias memorables con tus invitados.',
    ]);
  });
});
