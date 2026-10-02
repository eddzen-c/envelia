import type { Metadata } from 'next';

import { AuthShell } from '../../features/auth/components/auth-shell';
import { SignInForm } from '../../features/auth/components/sign-in-form';

export const metadata: Metadata = {
  title: 'Iniciar sesión | Envelia',
  description:
    'Accede a Envelia para continuar creando, organizando y compartiendo tus invitaciones.',
};

const SignInPage = () => (
  <AuthShell
    eyebrow="Tu espacio Envelia"
    title="Continúa creando momentos inolvidables"
    description="Inicia sesión para acceder a tus invitaciones y seguir personalizando cada celebración."
    alternatePrompt="¿Aún no tienes una cuenta?"
    alternateLabel="Crear cuenta"
    alternateHref="/crear-cuenta"
  >
    <SignInForm />
  </AuthShell>
);

export default SignInPage;
