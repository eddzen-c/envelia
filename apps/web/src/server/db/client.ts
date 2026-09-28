import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

export class DatabaseConfigurationError extends Error {
  constructor() {
    super('DATABASE_URL must contain a valid PostgreSQL connection URL.');
    this.name = 'DatabaseConfigurationError';
  }
}

const readDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new DatabaseConfigurationError();
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new DatabaseConfigurationError();
  }

  if (parsedUrl.protocol !== 'postgres:' && parsedUrl.protocol !== 'postgresql:') {
    throw new DatabaseConfigurationError();
  }

  return databaseUrl;
};

const createDatabase = () => {
  const sql = neon(readDatabaseUrl());

  return drizzle(sql, {
    schema,
  });
};

export type Database = ReturnType<typeof createDatabase>;

let database: Database | null = null;

export const getDb = (): Database => {
  database ??= createDatabase();

  return database;
};
