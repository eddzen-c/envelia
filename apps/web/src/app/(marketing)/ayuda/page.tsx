import type { Metadata } from 'next';
import { HelpContent } from './_components/help-content';

export const metadata: Metadata = {
  title: 'Ayuda | Envelia Studio',
  description:
    'Resuelve tus dudas sobre el estudio, la personalización y los enlaces de tus invitaciones digitales.',
};

export default function HelpPage() {
  return (
    <main className="relative isolate overflow-hidden bg-surface" id="main-content">
      <HelpContent />
    </main>
  );
}
