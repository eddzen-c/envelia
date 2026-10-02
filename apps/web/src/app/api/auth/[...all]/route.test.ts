import { afterEach, describe, expect, it, vi } from 'vitest';

const routeMocks = vi.hoisted(() => ({
  getAuth: vi.fn(),
  toNextJsHandler: vi.fn(),
  getHandler: vi.fn(),
  postHandler: vi.fn(),
}));

vi.mock('server-only', () => ({}));

vi.mock('@/server/auth/auth', () => ({
  getAuth: routeMocks.getAuth,
}));

vi.mock('better-auth/next-js', () => ({
  toNextJsHandler: routeMocks.toNextJsHandler,
}));

afterEach(() => {
  routeMocks.getAuth.mockReset();
  routeMocks.toNextJsHandler.mockReset();
  routeMocks.getHandler.mockReset();
  routeMocks.postHandler.mockReset();
  vi.resetModules();
});

describe('Better Auth Next.js route', () => {
  it('can be imported without creating the authentication provider', async () => {
    delete process.env.DATABASE_URL;
    delete process.env.BETTER_AUTH_SECRET;
    delete process.env.BETTER_AUTH_URL;

    const routeModule = await import('./route');

    expect(routeModule.GET).toBeTypeOf('function');
    expect(routeModule.POST).toBeTypeOf('function');
    expect(routeMocks.getAuth).not.toHaveBeenCalled();
    expect(routeMocks.toNextJsHandler).not.toHaveBeenCalled();
  });

  it('creates the handlers lazily and delegates GET and POST requests', async () => {
    const auth = {
      handler: vi.fn(),
    };

    const getResponse = Response.json({
      method: 'GET',
    });

    const postResponse = Response.json({
      method: 'POST',
    });

    routeMocks.getAuth.mockReturnValue(auth);
    routeMocks.toNextJsHandler.mockReturnValue({
      GET: routeMocks.getHandler,
      POST: routeMocks.postHandler,
    });
    routeMocks.getHandler.mockResolvedValue(getResponse);
    routeMocks.postHandler.mockResolvedValue(postResponse);

    const routeModule = await import('./route');

    expect(routeMocks.getAuth).not.toHaveBeenCalled();
    expect(routeMocks.toNextJsHandler).not.toHaveBeenCalled();

    const getRequest = new Request('http://localhost:3000/api/auth/get-session', {
      method: 'GET',
    });

    const postRequest = new Request('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: 'persona@example.test',
        password: 'secure-password',
      }),
    });

    const receivedGetResponse = await routeModule.GET(getRequest);
    const receivedPostResponse = await routeModule.POST(postRequest);

    expect(receivedGetResponse).toBe(getResponse);
    expect(receivedPostResponse).toBe(postResponse);

    expect(routeMocks.getAuth).toHaveBeenCalledTimes(1);
    expect(routeMocks.toNextJsHandler).toHaveBeenCalledTimes(1);
    expect(routeMocks.toNextJsHandler).toHaveBeenCalledWith(auth);

    expect(routeMocks.getHandler).toHaveBeenCalledTimes(1);
    expect(routeMocks.getHandler).toHaveBeenCalledWith(getRequest);

    expect(routeMocks.postHandler).toHaveBeenCalledTimes(1);
    expect(routeMocks.postHandler).toHaveBeenCalledWith(postRequest);
  });
});
