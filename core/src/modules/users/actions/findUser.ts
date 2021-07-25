import { UserNotFound } from '../../../common/errors';
import { UsersService } from '../services/UsersService';
import { ContextPlatforms } from '../../../common/ContextUtil';

export async function findUser(userIdentifier: string): Promise<string>
{
  const [ user ] = await UsersService.findByID(userIdentifier);
  if(! user)
    throw new UserNotFound();

  return user.id;
}

export async function findOrCreateUser({
  userIdentifier,
  discordGuildID,
  twitchChannelID,
} : {
  userIdentifier: string,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  let userFindKey = 'ids';
  let userCreateKey;

  if(discordGuildID)
  {
    userFindKey = 'discordIDs';
    userCreateKey = 'discordID';
  }
  if(twitchChannelID)
  {
    userFindKey = 'twitchIDs';
    userCreateKey = 'twitchID';
  }

  /* Get the user/s with the given user ID/s or Discord or Twitch ID/s. */
  const result = await UsersService.find({ [userFindKey]: userIdentifier });
  const [ user ] = result;
  if(! user)
  {
    const createUserParams = userCreateKey ? { [userCreateKey]: userIdentifier } : {};
    const createdUserID = await UsersService.create(createUserParams);
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
