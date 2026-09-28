import 'server-only';

import { getDb } from '../client';
import {
  createInvitationProjectRepository,
  type InvitationProjectRepository,
} from './invitation-project-repository';

let repository: InvitationProjectRepository | null = null;

export const getInvitationProjectRepository = (): InvitationProjectRepository => {
  repository ??= createInvitationProjectRepository(getDb());

  return repository;
};
