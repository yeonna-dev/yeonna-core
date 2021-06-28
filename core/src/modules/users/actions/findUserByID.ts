import { UsersService } from '../services/UsersService';

export async function findUserByID({
  userUUID,
  discordID,
  twitchID,
  createIfNotExisting,
} : {
  userUUID?: string,
  discordID?: string,
  twitchID?: string,
  createIfNotExisting?: boolean
})
{
  /* Get the user/s with the given user UUID/s or Discord or Twitch ID/s. */
  const result = await UsersService.find({
    uuids: userUUID,
    discordIDs: discordID,
    twitchIDs: twitchID,
  });

  const [ user ] = result;
  if(! user && createIfNotExisting)
  {
    const createdUserUUID = await UsersService.create({ discordID, twitchID });
    if(! createdUserUUID)
      throw new Error('User not saved');

    return createdUserUUID;
  }

  if(! user)
    return;

  if(! Array.isArray(user))
    return user.uuid;

  if(user.length === 0)
    return;

  return user.pop()?.uuid;
}
