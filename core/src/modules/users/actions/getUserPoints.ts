import { ObtainableService } from '../services/ObtainableService';

import { findUserID } from './findUserID';

export async function getUserPoints(user: string)
{
  user = await findUserID(user);
  return ObtainableService.getPoints(user);
}
