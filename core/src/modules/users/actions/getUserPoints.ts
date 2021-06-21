import { ObtainableService } from '../services/ObtainableService';

export async function getUserPoints({ userUUID, discordID } : { userUUID?: string, discordID?: string })
{
  return ObtainableService.getPoints({ userUUID, discordID });
}
