import { UsersService } from '../services/UsersService';
import { findUser } from './findUser';

export async function connectIdToUser({
  userIdentifier,
  newDiscordId,
  newTwitchId,
}: {
  userIdentifier: string,
  newDiscordId?: string,
  newTwitchId?: string,
})
{
  if(!newDiscordId && !newTwitchId)
    throw new Error('No new Discord or Twitch ID provided');

  /* Get the user/s with the given user ID/s or Discord or Twitch ID/s. */
  const user = await findUser(userIdentifier);

  /* Update the user record */
  await UsersService.updateById(user, { discordId: newDiscordId, twitchId: newTwitchId });
}
