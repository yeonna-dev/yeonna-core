import { ObtainableService } from '../services/ObtainableService'
import { findUserByID } from '.';

export async function updateUserPoints({
  user,
  amount,
  add,
  subtract,
  discordGuildID,
}: {
  user: string,
  amount: number,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string
}): Promise<void>
{
  user = await findUserByID(user, true);
  amount = Math.abs(amount);

  /* Check if the user's obtainable record is already created. */
  const points = await ObtainableService.getPoints(user);
  if(points === undefined)
  {
    /* Create the obtainable record. */
    await ObtainableService.addPoints({ userUUID: user, discordGuildID, amount })
    return;
  }

  await ObtainableService.updatePoints(
    user,
    add
      ? points + amount : subtract
      ? points - amount : amount
  );
}
