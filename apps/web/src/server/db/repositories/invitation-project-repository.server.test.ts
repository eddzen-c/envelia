import { beforeEach, describe, expect, it, vi } from 'vitest';

const { database, repository, createInvitationProjectRepositoryMock, getDbMock } = vi.hoisted(
  () => ({
    database: {
      kind: 'database',
    },
    repository: {
      kind: 'invitation-project-repository',
    },
    createInvitationProjectRepositoryMock: vi.fn(),
    getDbMock: vi.fn(),
  }),
);

vi.mock('server-only', () => ({}));

vi.mock('../client', () => ({
  getDb: getDbMock,
}));

vi.mock('./invitation-project-repository', () => ({
  createInvitationProjectRepository: createInvitationProjectRepositoryMock,
}));

describe('invitation project repository server composition', () => {
  beforeEach(() => {
    vi.resetModules();
    getDbMock.mockReset();
    createInvitationProjectRepositoryMock.mockReset();

    getDbMock.mockReturnValue(database);
    createInvitationProjectRepositoryMock.mockReturnValue(repository);
  });

  it('can be imported without requesting the database', async () => {
    const serverComposition = await import('./invitation-project-repository.server');

    expect(serverComposition.getInvitationProjectRepository).toEqual(expect.any(Function));
    expect(getDbMock).not.toHaveBeenCalled();
    expect(createInvitationProjectRepositoryMock).not.toHaveBeenCalled();
  });

  it('creates the repository lazily and reuses it', async () => {
    const { getInvitationProjectRepository } =
      await import('./invitation-project-repository.server');

    expect(getDbMock).not.toHaveBeenCalled();

    const firstRepository = getInvitationProjectRepository();
    const secondRepository = getInvitationProjectRepository();

    expect(firstRepository).toBe(repository);
    expect(secondRepository).toBe(repository);
    expect(getDbMock).toHaveBeenCalledTimes(1);
    expect(createInvitationProjectRepositoryMock).toHaveBeenCalledTimes(1);
    expect(createInvitationProjectRepositoryMock).toHaveBeenCalledWith(database);
  });
});
