import { UsersService } from '../services/UsersService';
import { ObtainableService } from '../services/ObtainableService';

import { UserNotFound } from '../../../common/errors';

export async function getUserPoints(user: string)
{
  /* Get the user with the given identifier, whether the identifier is a user UUID or Discord ID. */
  let userObject = await UsersService.findByUUID(user);
  if(! userObject)
  {
    userObject = await UsersService.findByDiscordID(user);
    if(! userObject)
      throw new UserNotFound();
  }

  return ObtainableService.getPoints(userObject.uuid);
}
