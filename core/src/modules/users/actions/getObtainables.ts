import { ObtainableService } from '../services/ObtainableService';
import { findUserByID } from './findUserByID';

export async function getObtainables({
  userUUID,
  discordID,
  isCollectible,
} : {
  userUUID?: string,
  discordID?: string,
  isCollectible?: boolean,
})
{
  /* Check if the user is existing. */
  userUUID = await findUserByID({ userUUID, discordID });
  if(! userUUID)
    return 0;

  return ObtainableService.getObtainable(userUUID, isCollectible);
}

export async function getUserPoints({ userUUID, discordID } : { userUUID?: string, discordID?: string })
{
  return getObtainables({ userUUID, discordID });
}

export async function getUserCollectibles({ userUUID, discordID } : { userUUID?: string, discordID?: string })
{
  return getObtainables({ userUUID, discordID, isCollectible: true });
}

