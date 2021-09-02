import { UsersService } from '../services/UsersService';

import { findUser } from './findUser';

export async function connectIDtoUser({
  userIdentifier,
  newDiscordID,
  newTwitchID,
} : {
  userIdentifier: string,
  newDiscordID?: string,
  newTwitchID?: string,
})
{
  if(! newDiscordID && ! newTwitchID)
    throw new Error('No new Discord or Twitch ID provided');

  /* Get the user/s with the given user ID/s or Discord or Twitch ID/s. */
  const user = await findUser(userIdentifier);

  /* Update the user record */
  await UsersService.updateByID(user, { discordID: newDiscordID, twitchID: newTwitchID });
}
