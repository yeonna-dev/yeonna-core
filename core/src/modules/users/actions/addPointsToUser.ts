import { ObtainableService } from '../services/ObtainableService'
import { UsersService } from '../services/UsersService';

import { UserNotFound } from '../../../common/errors';

export async function addPointsToUser({
  user,
  amount,
  discordGuildID,
}: {
  user: string,
  amount: number,
  discordGuildID?: string
}): Promise<void>
{
  /* Get the user with the given identifier, whether the identifier is a user UUID or Discord ID. */
  let userObject = await UsersService.findByUUID(user);
  if(! userObject)
  {
    userObject = await UsersService.findByDiscordID(user);
    if(! userObject)
    {
      const userUUID = await UsersService.create({ discordID: user });
      if(! user)
        throw new Error('User not saved');

      user = userUUID;
    }
    else
      user = userObject.uuid;
  }

  if(userObject)
    user = userObject.uuid;

  if(! user)
    throw new UserNotFound();

  /* Check if the user's obtainable record is already created. */
  const points = await ObtainableService.getPoints(user);
  if(! points)
  {
    /* Create the obtainable record. */
    await ObtainableService.addPoints({ userUUID: user, discordGuildID, amount })
    return;
  }

  await ObtainableService.updatePoints(user, amount + points);
}
