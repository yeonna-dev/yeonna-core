import { UserNotFound } from '../../../common/errors';
import { UsersService } from '../services/UsersService';

export async function findUserID(user: string, createIfNotExisting?: boolean)
{
  /* Get the user with the given identifier, whether the identifier is a user UUID or Discord ID. */
  let userObject = await UsersService.findByUUID(user);
  if(! userObject)
  {
    userObject = await UsersService.findByDiscordID(user);
    if(! userObject)
    {
      if(! createIfNotExisting)
        throw new UserNotFound();

      const userUUID = await UsersService.create({ discordID: user });
      if(! user)
        throw new Error('User not saved');

      user = userUUID;
    }
  }

  if(userObject)
    user = userObject.uuid;

  if(! user)
    throw new UserNotFound();

  return user;
}
