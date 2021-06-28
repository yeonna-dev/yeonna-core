import { UsersService } from '../services/UsersService';

import { UserNotFound } from '../../../common/errors';
import { findUserByID } from './findUserByID';

export async function connectIDtoUser({
  userUUID,
  discordID,
  twitchID,
  newDiscordID,
  newTwitchID,
} : {
  userUUID?: string,
  discordID?: string,
  twitchID?: string,
  newDiscordID?: string,
  newTwitchID?: string,
})
{
  if(! newDiscordID && ! newTwitchID)
    throw new Error('No new Discord or Twitch ID provided');

  /* Get the user/s with the given user UUID/s or Discord or Twitch ID/s. */
  const user = await findUserByID({ userUUID, discordID, twitchID });
  if(! user)
    throw new UserNotFound();

  /* Update the user record */
  await UsersService.updateByUUID(user, { discordID: newDiscordID, twitchID: newTwitchID });
}
