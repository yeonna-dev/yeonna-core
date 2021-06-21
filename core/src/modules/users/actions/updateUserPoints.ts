import { ObtainableService } from '../services/ObtainableService'
import { findUserByID } from '.';

export async function updateUserPoints({
  userUUID,
  discordID,
  amount,
  add,
  subtract,
  discordGuildID,
}: {
  userUUID?: string,
  discordID?: string,
  amount: number,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string
}): Promise<void>
{
  if(! userUUID)
  {
    userUUID = await findUserByID({ userUUID, discordID, createIfNotExisting: true });
    if(! userUUID)
      throw new Error('Cannot update user points');
  }

  /* Check if the user's obtainable record is already created. */
  const points = await ObtainableService.getPoints({ userUUID });

  /* Create the obtainable record if not existing. */
  if(points === undefined)
    await ObtainableService.createObtainable({ userUUID: userUUID, discordGuildID, amount })
  else
    await ObtainableService.updatePoints(
      userUUID,
      add
        ? points + amount : subtract
        ? points - amount : amount
    );
}
