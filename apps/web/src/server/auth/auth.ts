import 'server-only';

import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';

import { getDb } from '../db/client';
import * as authSchema from '../db/schema/auth';

const minimumAuthSecretLength = 32;

export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthConfigurationError';
  }
}

const readAuthSecret = () => {
  const secret = process.env.BETTER_AUTH_SECRET?.trim();

  if (!secret || secret.length < minimumAuthSecretLength) {
    throw new AuthConfigurationError(
      `BETTER_AUTH_SECRET must contain at least ${minimumAuthSecretLength} characters.`,
    );
  }

  return secret;
};

const readAuthBaseUrl = () => {
  const baseUrl = process.env.BETTER_AUTH_URL?.trim();

  if (!baseUrl) {
    throw new AuthConfigurationError('BETTER_AUTH_URL must contain a valid HTTP or HTTPS URL.');
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(baseUrl);
  } catch {
    throw new AuthConfigurationError('BETTER_AUTH_URL must contain a valid HTTP or HTTPS URL.');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new AuthConfigurationError('BETTER_AUTH_URL must contain a valid HTTP or HTTPS URL.');
  }

  return parsedUrl.toString().replace(/\/$/, '');
};

const createAuth = () => {
  const secret = readAuthSecret();
  const baseURL = readAuthBaseUrl();
  const database = getDb();

  return betterAuth({
    baseURL,
    secret,
    database: drizzleAdapter(database, {
      provider: 'pg',
      schema: authSchema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      database: {
        joins: true,
      },
    },
  });
};

export type Auth = ReturnType<typeof createAuth>;

let auth: Auth | null = null;

export const getAuth = (): Auth => {
  auth ??= createAuth();

  return auth;
};
