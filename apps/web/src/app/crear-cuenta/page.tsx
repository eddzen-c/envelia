import type { Metadata } from 'next';

import { AuthShell } from '../../features/auth/components/auth-shell';
import { SignUpForm } from '../../features/auth/components/sign-up-form';

export const metadata: Metadata = {
  title: 'Crear cuenta | Envelia',
  description:
    'Crea tu cuenta de Envelia para diseñar, organizar y conservar todas tus invitaciones.',
};

const SignUpPage = () => (
  <AuthShell
    eyebrow="Tu historia comienza aquí"
    title="Crea invitaciones que se sientan realmente tuyas"
    description="Abre tu espacio en Envelia y conserva cada celebración, desde la primera idea hasta el momento de compartirla."
    alternatePrompt="¿Ya tienes una cuenta?"
    alternateLabel="Iniciar sesión"
    alternateHref="/iniciar-sesion"
  >
    <SignUpForm />
  </AuthShell>
);

export default SignUpPage;
