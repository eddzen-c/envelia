import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Envelia Studio — Invitaciones que cobran vida',
    short_name: 'Envelia Studio',
    description: 'Crea, personaliza y comparte invitaciones digitales que cobran vida.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f8f5ee',
    theme_color: '#f8f5ee',
    lang: 'es-MX',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
