import { UserNotFound } from '../../../common/errors';
import { UsersService } from '../services/UsersService';

export async function findUser(userIdentifier: string): Promise<string>
{
  const [ user ] = await UsersService.findByID(userIdentifier);
  if(! user)
    throw new UserNotFound();

  return user.id;
}

export async function findOrCreateUser({
  userID,
  discordID,
  twitchID,
} : {
  userID?: string,
  discordID?: string,
  twitchID?: string,
})
{
  /* Get the user/s with the given user ID/s or Discord or Twitch ID/s. */
  const result = await UsersService.find({
    ids: userID,
    discordIDs: discordID,
    twitchIDs: twitchID,
  });

  const [ user ] = result;
  if(! user)
  {
    const createdUserID = await UsersService.create({ discordID, twitchID });
    if(! createdUserID)
      throw new Error('User not saved');

    return createdUserID;
  }

  if(! user)
    return;

  if(! Array.isArray(user))
    return user.id;

  if(user.length === 0)
    return;

  return user.pop()?.id;
}
