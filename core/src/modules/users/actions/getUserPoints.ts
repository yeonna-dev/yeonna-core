import { ObtainableService } from '../services/ObtainableService';

import { findUserByID } from './findUserByID';

export async function getUserPoints({
  userUUID,
  discordID,
} : {
  userUUID?: string,
  discordID?: string,
})
{
  const user = await findUserByID({ discordID, userUUID });
  return user ? ObtainableService.getPoints(user) : 0;
}
