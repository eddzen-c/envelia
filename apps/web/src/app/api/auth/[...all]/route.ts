import 'server-only';

import { toNextJsHandler } from 'better-auth/next-js';

import { getAuth } from '@/server/auth/auth';

type AuthRouteHandlers = ReturnType<typeof toNextJsHandler>;

let handlers: AuthRouteHandlers | null = null;

const getHandlers = (): AuthRouteHandlers => {
  handlers ??= toNextJsHandler(getAuth());

  return handlers;
};

export const GET = (request: Request) => getHandlers().GET(request);

export const POST = (request: Request) => getHandlers().POST(request);
