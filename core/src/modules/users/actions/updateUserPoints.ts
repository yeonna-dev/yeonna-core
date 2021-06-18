import { ObtainableService } from '../services/ObtainableService'
import { findUserID } from '.';

export async function updateUserPoints({
  user,
  amount,
  overwrite,
  discordGuildID,
}: {
  user: string,
  amount: number,
  overwrite?: boolean,
  discordGuildID?: string
}): Promise<void>
{
  user = await findUserID(user, true);

  /* Check if the user's obtainable record is already created. */
  const points = await ObtainableService.getPoints(user);
  if(! points)
  {
    /* Create the obtainable record. */
    await ObtainableService.addPoints({ userUUID: user, discordGuildID, amount })
    return;
  }

  await ObtainableService.updatePoints(user, overwrite ? amount : points + Math.abs(amount));
}
