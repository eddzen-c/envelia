'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { FormEvent } from 'react';

import { signUp } from '../model/auth-client';

const passwordMismatchMessage = 'Las contraseñas no coinciden.';

const registrationErrorMessage =
  'No pudimos crear tu cuenta. Revisa los datos e inténtalo de nuevo.';

export const SignUpForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);

    if (password !== passwordConfirmation) {
      setErrorMessage(passwordMismatchMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(registrationErrorMessage);
        return;
      }

      router.replace('/studio');
      router.refresh();
    } catch {
      setErrorMessage(registrationErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-5"
      aria-label="Formulario para crear una cuenta"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground" htmlFor="sign-up-name">
          Nombre
        </label>

        <input
          id="sign-up-name"
          className="min-h-12 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Tu nombre"
          value={name}
          minLength={2}
          maxLength={80}
          disabled={isSubmitting}
          required
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground" htmlFor="sign-up-email">
          Correo electrónico
        </label>

        <input
          id="sign-up-email"
          className="min-h-12 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="tu@correo.com"
          value={email}
          disabled={isSubmitting}
          required
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground" htmlFor="sign-up-password">
          Contraseña
        </label>

        <input
          id="sign-up-password"
          className="min-h-12 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          minLength={8}
          maxLength={128}
          disabled={isSubmitting}
          required
          aria-describedby="sign-up-password-help"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <p id="sign-up-password-help" className="text-sm leading-6 text-muted-foreground">
          Utiliza entre 8 y 128 caracteres.
        </p>
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-foreground"
          htmlFor="sign-up-password-confirmation"
        >
          Confirmar contraseña
        </label>

        <input
          id="sign-up-password-confirmation"
          className="min-h-12 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          type="password"
          name="passwordConfirmation"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          value={passwordConfirmation}
          minLength={8}
          maxLength={128}
          disabled={isSubmitting}
          required
          aria-describedby={errorMessage ? 'sign-up-error' : undefined}
          onChange={(event) => {
            setPasswordConfirmation(event.target.value);
          }}
        />
      </div>

      {errorMessage ? (
        <p
          id="sign-up-error"
          className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Creando tu cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  );
};
