import { UsersService } from '../services/UsersService';
import { ObtainableService } from '../services/ObtainableService'

export async function addPointsToUser(
  userDiscordID: string,
  discordGuildID: string,
  amount: number,
): Promise<void>
{
  let userUUID;

  /* Check if the user with the given Discord ID is already created. */
  const user = await UsersService.getByDiscordID(userDiscordID);
  if(! user)
  {
    /* Create the user record if not yet existing. */
    userUUID = await UsersService.create({ discordID: userDiscordID });
    if(! userUUID)
      throw new Error('User not saved');
  }
  else
    userUUID = user.uuid;

  /* Check if the user's obtainable record is already created. */
  const points = await ObtainableService.getPoints(userUUID);
  if(! points)
  {
    /* Create the obtainable record. */
    await ObtainableService.addPoints({ userUUID, discordGuildID, amount })
    return;
  }

  await ObtainableService.updatePoints(userUUID, amount + points);
}
