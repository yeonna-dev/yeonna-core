import { getObtainables } from './getObtainables';

export async function getUserPoints({ userUUID, discordID } : { userUUID?: string, discordID?: string })
{
  return getObtainables({ userUUID, discordID });
}
