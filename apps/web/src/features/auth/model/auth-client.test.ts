import { afterEach, describe, expect, it, vi } from 'vitest';

const clientMocks = vi.hoisted(() => ({
  createAuthClient: vi.fn(),
}));

vi.mock('better-auth/react', () => ({
  createAuthClient: clientMocks.createAuthClient,
}));

afterEach(() => {
  clientMocks.createAuthClient.mockReset();
  vi.resetModules();
});

describe('Better Auth React client', () => {
  it('creates one same-origin client and exposes the authentication operations', async () => {
    const client = {
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      useSession: vi.fn(),
    };

    clientMocks.createAuthClient.mockReturnValue(client);

    const clientModule = await import('./auth-client');

    expect(clientMocks.createAuthClient).toHaveBeenCalledTimes(1);
    expect(clientMocks.createAuthClient).toHaveBeenCalledWith();

    expect(clientModule.authClient).toBe(client);
    expect(clientModule.signIn).toBe(client.signIn);
    expect(clientModule.signOut).toBe(client.signOut);
    expect(clientModule.signUp).toBe(client.signUp);
    expect(clientModule.useSession).toBe(client.useSession);
  });
});
