import { findUserByID } from './findUserByID';

import { ObtainableService } from '../services/ObtainableService';

import { NotEnoughPoints } from '../../../common/errors';

export async function transferUserPoints(
  fromUserID: string,
  toUserID: string,
  amount: number,
  discordGuildID?: string,
): Promise<void>
{
  amount = Math.abs(amount);

  /* Get the points of the user to get points from (source user) */
  const source = await findUserByID(fromUserID);
  if(! source)
    throw new NotEnoughPoints();

  const sourcePoints = await ObtainableService.getPoints(source) || 0;

  /* Check if the source user has less points than the given amount. */
  if(! sourcePoints || sourcePoints < amount)
    throw new NotEnoughPoints();

  /* Get the points of user to add points to (target user). */
  const target = await findUserByID(toUserID, true);

  /* Add points to the target user. */
  const targetPoints = await ObtainableService.getPoints(target);
  if(! targetPoints)
    await ObtainableService.addPoints({ userUUID: target, discordGuildID, amount });
  else
    await ObtainableService.updatePoints(target, targetPoints + amount);

  /* Subtract points from the source user. */
  await ObtainableService.updatePoints(source, sourcePoints - amount);
}
