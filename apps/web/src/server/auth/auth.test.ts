import { afterEach, describe, expect, it, vi } from 'vitest';

const authMocks = vi.hoisted(() => ({
  betterAuth: vi.fn(),
  drizzleAdapter: vi.fn(),
  getDb: vi.fn(),
}));

vi.mock('server-only', () => ({}));

vi.mock('better-auth', () => ({
  betterAuth: authMocks.betterAuth,
}));

vi.mock('@better-auth/drizzle-adapter', () => ({
  drizzleAdapter: authMocks.drizzleAdapter,
}));

vi.mock('../db/client', () => ({
  getDb: authMocks.getDb,
}));

const originalAuthSecret = process.env.BETTER_AUTH_SECRET;
const originalAuthUrl = process.env.BETTER_AUTH_URL;

const restoreEnvironment = () => {
  if (originalAuthSecret === undefined) {
    delete process.env.BETTER_AUTH_SECRET;
  } else {
    process.env.BETTER_AUTH_SECRET = originalAuthSecret;
  }

  if (originalAuthUrl === undefined) {
    delete process.env.BETTER_AUTH_URL;
  } else {
    process.env.BETTER_AUTH_URL = originalAuthUrl;
  }
};

afterEach(() => {
  restoreEnvironment();
  authMocks.betterAuth.mockReset();
  authMocks.drizzleAdapter.mockReset();
  authMocks.getDb.mockReset();
  vi.resetModules();
});

describe('Better Auth server composition', () => {
  it('can be imported without authentication or database configuration', async () => {
    delete process.env.BETTER_AUTH_SECRET;
    delete process.env.BETTER_AUTH_URL;

    const authModule = await import('./auth');

    expect(authModule.getAuth).toBeTypeOf('function');
    expect(authMocks.getDb).not.toHaveBeenCalled();
    expect(authMocks.drizzleAdapter).not.toHaveBeenCalled();
    expect(authMocks.betterAuth).not.toHaveBeenCalled();
  });

  it('rejects a missing authentication secret before requesting the database', async () => {
    delete process.env.BETTER_AUTH_SECRET;
    process.env.BETTER_AUTH_URL = 'http://localhost:3000';

    const { AuthConfigurationError, getAuth } = await import('./auth');

    expect(() => getAuth()).toThrow(AuthConfigurationError);
    expect(() => getAuth()).toThrow('BETTER_AUTH_SECRET must contain at least 32 characters.');
    expect(authMocks.getDb).not.toHaveBeenCalled();
  });

  it('rejects a short authentication secret', async () => {
    process.env.BETTER_AUTH_SECRET = 'too-short';
    process.env.BETTER_AUTH_URL = 'http://localhost:3000';

    const { getAuth } = await import('./auth');

    expect(() => getAuth()).toThrow('BETTER_AUTH_SECRET must contain at least 32 characters.');
    expect(authMocks.getDb).not.toHaveBeenCalled();
  });

  it('rejects a missing authentication URL before requesting the database', async () => {
    process.env.BETTER_AUTH_SECRET = 's'.repeat(32);
    delete process.env.BETTER_AUTH_URL;

    const { AuthConfigurationError, getAuth } = await import('./auth');

    expect(() => getAuth()).toThrow(AuthConfigurationError);
    expect(() => getAuth()).toThrow('BETTER_AUTH_URL must contain a valid HTTP or HTTPS URL.');
    expect(authMocks.getDb).not.toHaveBeenCalled();
  });

  it('rejects malformed and unsupported authentication URLs', async () => {
    process.env.BETTER_AUTH_SECRET = 's'.repeat(32);
    process.env.BETTER_AUTH_URL = 'not-a-url';

    const malformedModule = await import('./auth');

    expect(() => malformedModule.getAuth()).toThrow(
      'BETTER_AUTH_URL must contain a valid HTTP or HTTPS URL.',
    );
    expect(authMocks.getDb).not.toHaveBeenCalled();

    vi.resetModules();
    process.env.BETTER_AUTH_URL = 'ftp://example.test';

    const unsupportedModule = await import('./auth');

    expect(() => unsupportedModule.getAuth()).toThrow(
      'BETTER_AUTH_URL must contain a valid HTTP or HTTPS URL.',
    );
    expect(authMocks.getDb).not.toHaveBeenCalled();
  });

  it('creates and reuses one configured authentication instance lazily', async () => {
    const database = {
      kind: 'database',
    };
    const adapter = {
      kind: 'drizzle-adapter',
    };
    const auth = {
      handler: vi.fn(),
    };

    process.env.BETTER_AUTH_SECRET = 's'.repeat(32);
    process.env.BETTER_AUTH_URL = 'http://localhost:3000/';

    authMocks.getDb.mockReturnValue(database);
    authMocks.drizzleAdapter.mockReturnValue(adapter);
    authMocks.betterAuth.mockReturnValue(auth);

    const { getAuth } = await import('./auth');

    expect(authMocks.getDb).not.toHaveBeenCalled();
    expect(authMocks.drizzleAdapter).not.toHaveBeenCalled();
    expect(authMocks.betterAuth).not.toHaveBeenCalled();

    const firstAuth = getAuth();
    const secondAuth = getAuth();

    expect(firstAuth).toBe(auth);
    expect(secondAuth).toBe(auth);
    expect(authMocks.getDb).toHaveBeenCalledTimes(1);
    expect(authMocks.drizzleAdapter).toHaveBeenCalledTimes(1);
    expect(authMocks.drizzleAdapter).toHaveBeenCalledWith(
      database,
      expect.objectContaining({
        provider: 'pg',
        schema: expect.objectContaining({
          user: expect.any(Object),
          session: expect.any(Object),
          account: expect.any(Object),
          verification: expect.any(Object),
        }),
      }),
    );
    expect(authMocks.betterAuth).toHaveBeenCalledTimes(1);
    expect(authMocks.betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'http://localhost:3000',
        secret: 's'.repeat(32),
        database: adapter,
        emailAndPassword: {
          enabled: true,
        },
        advanced: {
          database: {
            joins: true,
          },
        },
      }),
    );
  });
});
