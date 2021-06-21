import { UsersService } from '../services/UsersService';

export async function findUserByID({
  userUUID,
  discordID,
  createIfNotExisting,
} : {
  userUUID?: string,
  discordID?: string,
  createIfNotExisting?: boolean
})
{
  /* Get the user/s with the given user UUID/s or Discord ID/s. */
  let result;
  if(discordID)
    result = await UsersService.findByDiscordID(discordID);
  else if(userUUID)
    result = await UsersService.findByUUID(userUUID);

  if(! result && createIfNotExisting)
  {
    const createdUserUUID = await UsersService.create({ userUUID, discordID });
    if(! createdUserUUID)
      throw new Error('User not saved');

    return createdUserUUID;
  }

  if(! result)
    return;

  if(! Array.isArray(result))
    return result.uuid;

  if(result.length === 0)
    return;

  return result.pop()?.uuid;
}
