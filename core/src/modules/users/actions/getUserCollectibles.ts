import { getObtainables } from './getObtainables';

export async function getUserCollectibles({ userUUID, discordID } : { userUUID?: string, discordID?: string })
{
  return getObtainables({ userUUID, discordID, isCollectible: true });
}
