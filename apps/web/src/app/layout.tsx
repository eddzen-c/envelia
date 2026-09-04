import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  applicationName: 'Envelia Studio',
  title: {
    default: 'Envelia Studio — Invitaciones que cobran vida',
    template: '%s | Envelia Studio',
  },
  description: 'Crea, personaliza y comparte invitaciones digitales que cobran vida.',
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8f5ee',
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es-MX">
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <a
          className="fixed top-4 left-4 z-50 -translate-y-24 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-soft transition-transform focus:translate-y-0 motion-reduce:transition-none"
          href="#main-content"
        >
          Saltar al contenido principal
        </a>

        {children}
      </body>
    </html>
  );
}
