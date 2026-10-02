'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { FormEvent } from 'react';

import { signIn } from '../model/auth-client';

const authenticationErrorMessage =
  'No pudimos iniciar sesión. Verifica tu correo y contraseña e inténtalo de nuevo.';

export const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { error } = await signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        setErrorMessage(authenticationErrorMessage);
        return;
      }

      router.replace('/studio');
      router.refresh();
    } catch {
      setErrorMessage(authenticationErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" aria-label="Formulario de inicio de sesión" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground" htmlFor="sign-in-email">
          Correo electrónico
        </label>

        <input
          id="sign-in-email"
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
        <label className="block text-sm font-semibold text-foreground" htmlFor="sign-in-password">
          Contraseña
        </label>

        <input
          id="sign-in-password"
          className="min-h-12 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          value={password}
          minLength={8}
          maxLength={128}
          disabled={isSubmitting}
          required
          aria-describedby={errorMessage ? 'sign-in-error' : undefined}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </div>

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-muted-foreground">
        <input
          className="size-4 rounded border-border accent-primary"
          type="checkbox"
          name="rememberMe"
          checked={rememberMe}
          disabled={isSubmitting}
          onChange={(event) => {
            setRememberMe(event.target.checked);
          }}
        />

        <span>Mantener mi sesión iniciada</span>
      </label>

      {errorMessage ? (
        <p
          id="sign-in-error"
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
        {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </button>
    </form>
  );
};
