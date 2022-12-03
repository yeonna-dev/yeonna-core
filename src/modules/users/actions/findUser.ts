import { UserNotFound } from '../../../common/errors';
import { Identifiers } from '../../../common/types';
import { UserService } from '../services/UserService';

export async function findUser(userIdentifier: string): Promise<string>
{
  const [user] = await UserService.findById(userIdentifier);
  if(!user)
    throw new UserNotFound();

  return user.id;
}

export async function findOrCreateUser({
  userIdentifier,
  discordGuildId,
  twitchChannelId,
}: Identifiers)
{
  // TODO: Try to use actual objects for the params instead of dynamic key names.
  let userFindKey = 'ids';
  let userCreateKey;

  if(discordGuildId)
  {
    userFindKey = 'discordIds';
    userCreateKey = 'discordId';
  }
  if(twitchChannelId)
  {
    userFindKey = 'twitchIds';
    userCreateKey = 'twitchId';
  }

  /* Get the user/s with the given user ID/s or Discord or Twitch ID/s. */
  const result = await UserService.find({ [userFindKey]: userIdentifier });
  const [user] = result;
  if(!user)
  {
    const createUserParams = userCreateKey ? { [userCreateKey]: userIdentifier } : {};
    const createdUserId = await UserService.create(createUserParams);
    if(!createdUserId)
      throw new Error('User not saved');

    return createdUserId;
  }

  if(!user)
    return;

  if(!Array.isArray(user))
    return user.id;

  if(user.length === 0)
    return;

  return user.pop()?.id;
}
