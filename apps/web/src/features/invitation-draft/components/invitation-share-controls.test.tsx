import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createInitialInvitationDraft, type InvitationDraft } from '../model/invitation-draft';
import { parsePortableInvitationPayload } from '../model/invitation-draft-portable-link';
import {
  InvitationShareControls,
  type InvitationShareData,
  type InvitationShareEnvironment,
} from './invitation-share-controls';

type ShareFunction = NonNullable<InvitationShareEnvironment['share']>;

type WriteTextFunction = NonNullable<InvitationShareEnvironment['writeText']>;

const createEnvironment = (
  overrides: Partial<InvitationShareEnvironment> = {},
): InvitationShareEnvironment => ({
  origin: 'https://envelia.test/studio',
  ...overrides,
});

const renderControls = (
  environment: InvitationShareEnvironment,
  draft: InvitationDraft = createInitialInvitationDraft(),
) => {
  const user = userEvent.setup();

  render(<InvitationShareControls draft={draft} environment={environment} />);

  return {
    user,
    button: screen.getByRole('button', {
      name: 'Compartir invitación',
    }),
    status: screen.getByRole('status', {
      name: 'Estado del enlace compartible',
    }),
  };
};

const readSharedData = (share: ReturnType<typeof vi.fn<ShareFunction>>): InvitationShareData => {
  const firstCall = share.mock.calls[0];

  if (!firstCall) {
    throw new Error('Expected Web Share to receive data');
  }

  return firstCall[0];
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('InvitationShareControls', () => {
  it('shares a valid fragment URL through Web Share when available', async () => {
    const share = vi.fn<ShareFunction>().mockResolvedValue(undefined);
    const writeText = vi.fn<WriteTextFunction>().mockResolvedValue(undefined);
    const draft = createInitialInvitationDraft();
    const { user, button, status } = renderControls(
      createEnvironment({
        origin: 'https://envelia.test/studio?source=draft',
        share,
        writeText,
      }),
      draft,
    );

    await user.click(button);

    await waitFor(() => {
      expect(status).toHaveTextContent('Invitación compartida correctamente.');
    });

    expect(share).toHaveBeenCalledTimes(1);
    expect(writeText).not.toHaveBeenCalled();

    const shareData = readSharedData(share);
    const sharedUrl = new URL(shareData.url);

    expect(shareData.title).toBe(draft.eventTitle);
    expect(shareData.text).toBe('Has recibido una invitación creada con Envelia Studio.');
    expect(sharedUrl.origin).toBe('https://envelia.test');
    expect(sharedUrl.pathname).toBe('/invitation');
    expect(sharedUrl.search).toBe('');
    expect(sharedUrl.hash).not.toBe('');

    expect(parsePortableInvitationPayload(sharedUrl.hash)).toEqual({
      status: 'decoded',
      draft,
    });
  });

  it('copies the portable URL when Web Share is unavailable', async () => {
    const writeText = vi.fn<WriteTextFunction>().mockResolvedValue(undefined);
    const draft = createInitialInvitationDraft();
    const { user, button, status } = renderControls(
      createEnvironment({
        writeText,
      }),
      draft,
    );

    await user.click(button);

    await waitFor(() => {
      expect(status).toHaveTextContent('Enlace copiado al portapapeles.');
    });

    expect(writeText).toHaveBeenCalledTimes(1);

    const copiedUrlValue = writeText.mock.calls[0]?.[0];

    if (!copiedUrlValue) {
      throw new Error('Expected a portable URL to be copied');
    }

    const copiedUrl = new URL(copiedUrlValue);

    expect(copiedUrl.pathname).toBe('/invitation');
    expect(copiedUrl.search).toBe('');
    expect(parsePortableInvitationPayload(copiedUrl.hash)).toEqual({
      status: 'decoded',
      draft,
    });
  });

  it('uses the clipboard after a non-cancellation Web Share failure', async () => {
    const share = vi.fn<ShareFunction>().mockRejectedValue(new Error('Native share failed'));
    const writeText = vi.fn<WriteTextFunction>().mockResolvedValue(undefined);
    const { user, button, status } = renderControls(
      createEnvironment({
        share,
        writeText,
      }),
    );

    await user.click(button);

    await waitFor(() => {
      expect(status).toHaveTextContent('Enlace copiado al portapapeles.');
    });

    expect(share).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it('respects a cancelled Web Share operation without copying', async () => {
    const cancellation = new Error('Share cancelled');

    cancellation.name = 'AbortError';

    const share = vi.fn<ShareFunction>().mockRejectedValue(cancellation);
    const writeText = vi.fn<WriteTextFunction>().mockResolvedValue(undefined);
    const { user, button, status } = renderControls(
      createEnvironment({
        share,
        writeText,
      }),
    );

    await user.click(button);

    await waitFor(() => {
      expect(status).toHaveTextContent('No se compartió la invitación.');
    });

    expect(share).toHaveBeenCalledTimes(1);
    expect(writeText).not.toHaveBeenCalled();
  });

  it('reports failure when the clipboard rejects the portable URL', async () => {
    const writeText = vi.fn<WriteTextFunction>().mockRejectedValue(new Error('Clipboard denied'));
    const { user, button, status } = renderControls(
      createEnvironment({
        writeText,
      }),
    );

    await user.click(button);

    await waitFor(() => {
      expect(status).toHaveTextContent('No pudimos compartir ni copiar el enlace.');
    });

    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it('reports unavailable browser sharing capabilities', async () => {
    const { user, button, status } = renderControls(createEnvironment());

    await user.click(button);

    await waitFor(() => {
      expect(status).toHaveTextContent(
        'Las opciones para compartir no están disponibles en este navegador.',
      );
    });
  });

  it('rejects an invalid origin before invoking the clipboard', async () => {
    const writeText = vi.fn<WriteTextFunction>().mockResolvedValue(undefined);
    const { user, button, status } = renderControls({
      origin: 'not-a-valid-origin',
      writeText,
    });

    await user.click(button);

    await waitFor(() => {
      expect(status).toHaveTextContent(
        'Las opciones para compartir no están disponibles en este navegador.',
      );
    });

    expect(writeText).not.toHaveBeenCalled();
  });

  it('uses a meaningful title when the event title is empty', async () => {
    const share = vi.fn<ShareFunction>().mockResolvedValue(undefined);
    const draft: InvitationDraft = {
      ...createInitialInvitationDraft(),
      eventTitle: '',
    };
    const { user, button } = renderControls(
      createEnvironment({
        share,
      }),
      draft,
    );

    await user.click(button);

    await waitFor(() => {
      expect(share).toHaveBeenCalledTimes(1);
    });

    expect(readSharedData(share).title).toBe('Invitación de Envelia Studio');
  });
});
