import { ObtainableService } from '../services/ObtainableService';
import { UsersService } from '../services/UsersService';

export async function getDiscordUserPoints(userDiscordID: string)
{
  const user = await UsersService.getByDiscordID(userDiscordID);
  if(! user)
    throw new Error('User not found');

  return ObtainableService.getPoints(user.uuid);
}
