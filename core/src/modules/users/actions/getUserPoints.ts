import { ObtainableService } from '../services/ObtainableService';

import { findUserByID } from './findUserByID';

export async function getUserPoints(user: string)
{
  user = await findUserByID(user);
  return ObtainableService.getPoints(user);
}
