import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ContactPage, { metadata } from './page';
import { createContactMailto } from './_components/contact-details';

describe('ContactPage', () => {
  it('presents the contact experience and confirmed channels', () => {
    render(<ContactPage />);
    expect(metadata.title).toBe('Contacto | Envelia Studio');
    expect(screen.getByRole('heading', { level: 1, name: 'Contacto' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+52 55 1234 5678' })).toHaveAttribute(
      'href',
      'https://wa.me/525512345678',
    );
    expect(screen.getByRole('link', { name: 'hola@enveliastudio.com' })).toHaveAttribute(
      'href',
      'mailto:hola@enveliastudio.com',
    );
    expect(screen.getByRole('list', { name: 'Nuestro compromiso' }).children).toHaveLength(5);
  });
  it('prepares a message and invalidates it after editing', async () => {
    const user = userEvent.setup();
    render(<ContactPage />);
    await user.type(screen.getByRole('textbox', { name: 'Nombre completo' }), 'Ana López');
    await user.type(screen.getByRole('textbox', { name: 'Correo electrónico' }), 'ana@example.com');
    await user.selectOptions(screen.getByRole('combobox'), 'Crear mi invitación');
    await user.type(
      screen.getByRole('textbox', { name: 'Tu mensaje' }),
      'Quiero crear una invitación para mi boda.',
    );
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(screen.getByRole('status')).toHaveTextContent('Tu mensaje está preparado');
    const link = screen.getByRole('link', { name: /abrir mi correo/i });
    expect(decodeURIComponent(link.getAttribute('href') ?? '')).toContain('ana@example.com');
    await user.type(screen.getByRole('textbox', { name: 'Tu mensaje' }), ' Gracias.');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('encodes message data without allowing query parameters to be injected', () => {
    const href = createContactMailto(
      'Ana',
      'ana@example.com',
      'Otro tema',
      'Hola &bcc=other@example.com\n¿Me ayudas?',
    );
    const params = new URL(href).searchParams;
    expect(params.get('bcc')).toBeNull();
    expect(params.get('body')).toContain('Hola &bcc=other@example.com');
  });
});
