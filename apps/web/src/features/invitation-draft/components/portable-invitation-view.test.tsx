import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createInitialInvitationDraft, type InvitationDraft } from '../model/invitation-draft';
import {
  encodePortableInvitationDraft,
  portableInvitationMaxEncodedLength,
  portableInvitationPayloadVersion,
} from '../model/invitation-draft-portable-link';
import { PortableInvitationView } from './portable-invitation-view';

const encodeBytesAsBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/gu, '-')
    .replace(/\//gu, '_')
    .replace(/=+$/u, '');

const encodeValueAsBase64Url = (value: unknown) =>
  encodeBytesAsBase64Url(new TextEncoder().encode(JSON.stringify(value)));

const getPortablePayload = (draft: InvitationDraft) => {
  const result = encodePortableInvitationDraft(draft);

  if (result.status !== 'encoded') {
    throw new Error('Expected the invitation draft to be encoded');
  }

  return result.payload;
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('PortableInvitationView', () => {
  it('opens a valid invitation as an accessible shared article', async () => {
    const payload = getPortablePayload(createInitialInvitationDraft());

    render(<PortableInvitationView fragment={`#${payload}`} />);

    expect(screen.getByRole('status')).toHaveTextContent('Abriendo la invitación');

    const invitation = await screen.findByRole('article', {
      name: 'Invitación compartida',
    });

    expect(invitation).toHaveAttribute('data-presentation', 'shared');
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Andrea & Mateo',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('18 de octubre de 2026')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Crear mi invitación',
      }),
    ).toHaveAttribute('href', '/studio');
  });

  it('updates the shared invitation when its fragment changes', async () => {
    const initialPayload = getPortablePayload(createInitialInvitationDraft());

    const nextDraft: InvitationDraft = {
      eventTitle: 'Graduación de Valeria',
      eventDate: '2027-07-16',
      location: 'Teatro Central · Puebla',
      message: 'Acompáñanos a celebrar este gran logro.',
      theme: 'midnight',
    };

    const nextPayload = getPortablePayload(nextDraft);

    const { rerender } = render(<PortableInvitationView fragment={`#${initialPayload}`} />);

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Andrea & Mateo',
      }),
    ).toBeInTheDocument();

    rerender(<PortableInvitationView fragment={`#${nextPayload}`} />);

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Graduación de Valeria',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: 'Andrea & Mateo',
      }),
    ).not.toBeInTheDocument();
  });

  it('offers recovery when the portable fragment is empty', async () => {
    render(<PortableInvitationView fragment="#" />);

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'El enlace está incompleto',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Crear una invitación',
      }),
    ).toHaveAttribute('href', '/studio');
    expect(
      screen.getByRole('link', {
        name: 'Volver al inicio',
      }),
    ).toHaveAttribute('href', '/');
  });

  it('explains that a corrupted portable link cannot be opened', async () => {
    render(<PortableInvitationView fragment="#not+base64" />);

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'No pudimos abrir esta invitación',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/datos locales permanecen intactos/iu)).toBeInTheDocument();
  });

  it('reports an unsupported portable invitation version', async () => {
    const payload = encodeValueAsBase64Url({
      version: portableInvitationPayloadVersion + 1,
      draft: createInitialInvitationDraft(),
    });

    render(<PortableInvitationView fragment={`#${payload}`} />);

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Esta invitación usa una versión no compatible',
      }),
    ).toBeInTheDocument();
  });

  it('rejects a portable fragment above the size boundary', async () => {
    const oversizedPayload = 'A'.repeat(portableInvitationMaxEncodedLength + 1);

    render(<PortableInvitationView fragment={`#${oversizedPayload}`} />);

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'El enlace supera el tamaño permitido',
      }),
    ).toBeInTheDocument();
  });

  it('never reads from or writes to browser storage', async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
    const payload = getPortablePayload(createInitialInvitationDraft());

    render(<PortableInvitationView fragment={`#${payload}`} />);

    expect(
      await screen.findByRole('article', {
        name: 'Invitación compartida',
      }),
    ).toBeInTheDocument();

    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
  });
});
