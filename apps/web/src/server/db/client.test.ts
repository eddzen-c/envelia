import { afterEach, describe, expect, it, vi } from 'vitest';

const databaseMocks = vi.hoisted(() => ({
  neon: vi.fn(),
  drizzle: vi.fn(),
}));

vi.mock('@neondatabase/serverless', () => ({
  neon: databaseMocks.neon,
}));

vi.mock('drizzle-orm/neon-http', () => ({
  drizzle: databaseMocks.drizzle,
}));

const originalDatabaseUrl = process.env.DATABASE_URL;

const restoreDatabaseUrl = () => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;

    return;
  }

  process.env.DATABASE_URL = originalDatabaseUrl;
};

afterEach(() => {
  restoreDatabaseUrl();
  databaseMocks.neon.mockReset();
  databaseMocks.drizzle.mockReset();
  vi.resetModules();
});

describe('database client', () => {
  it('can be imported without DATABASE_URL', async () => {
    delete process.env.DATABASE_URL;

    const databaseModule = await import('./client');

    expect(databaseModule.getDb).toBeTypeOf('function');
    expect(databaseMocks.neon).not.toHaveBeenCalled();
    expect(databaseMocks.drizzle).not.toHaveBeenCalled();
  }, 15_000);

  it('rejects a missing DATABASE_URL only when the database is requested', async () => {
    delete process.env.DATABASE_URL;

    const { DatabaseConfigurationError, getDb } = await import('./client');

    expect(() => getDb()).toThrow(DatabaseConfigurationError);
    expect(databaseMocks.neon).not.toHaveBeenCalled();
    expect(databaseMocks.drizzle).not.toHaveBeenCalled();
  });

  it('rejects malformed connection values without exposing them', async () => {
    process.env.DATABASE_URL = 'not-a-database-url';

    const { getDb } = await import('./client');

    expect(() => getDb()).toThrow('DATABASE_URL must contain a valid PostgreSQL connection URL.');
    expect(databaseMocks.neon).not.toHaveBeenCalled();
    expect(databaseMocks.drizzle).not.toHaveBeenCalled();
  });

  it('rejects URLs that do not use a PostgreSQL protocol', async () => {
    process.env.DATABASE_URL = 'https://database.example.test/envelia';

    const { getDb } = await import('./client');

    expect(() => getDb()).toThrow('DATABASE_URL must contain a valid PostgreSQL connection URL.');
    expect(databaseMocks.neon).not.toHaveBeenCalled();
    expect(databaseMocks.drizzle).not.toHaveBeenCalled();
  });

  it('creates and reuses one database client lazily', async () => {
    const databaseUrl = 'postgresql://envelia:secret@database.example.test/envelia';
    const sqlClient = {
      kind: 'neon-client',
    };
    const database = {
      kind: 'drizzle-database',
    };

    process.env.DATABASE_URL = databaseUrl;
    databaseMocks.neon.mockReturnValue(sqlClient);
    databaseMocks.drizzle.mockReturnValue(database);

    const { getDb } = await import('./client');

    expect(databaseMocks.neon).not.toHaveBeenCalled();
    expect(databaseMocks.drizzle).not.toHaveBeenCalled();

    const firstDatabase = getDb();
    const secondDatabase = getDb();

    expect(firstDatabase).toBe(database);
    expect(secondDatabase).toBe(database);
    expect(databaseMocks.neon).toHaveBeenCalledTimes(1);
    expect(databaseMocks.neon).toHaveBeenCalledWith(databaseUrl);
    expect(databaseMocks.drizzle).toHaveBeenCalledTimes(1);
    expect(databaseMocks.drizzle).toHaveBeenCalledWith(
      sqlClient,
      expect.objectContaining({
        schema: expect.any(Object),
      }),
    );
  });
});
