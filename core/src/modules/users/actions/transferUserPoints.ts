import { findUserByID } from './findUserByID';

import { ObtainableService } from '../services/ObtainableService';

import { NotEnoughPoints } from '../../../common/errors';

export async function transferUserPoints({
  fromUserUUID,
  fromDiscordUserID,
  toUserUUID,
  toDiscordUserID,
  amount,
  discordGuildID,
} : {
  fromUserUUID?: string,
  fromDiscordUserID?: string,
  toUserUUID?: string,
  toDiscordUserID?: string,
  amount: number,
  discordGuildID?: string,
}): Promise<void>
{
  amount = Math.abs(amount);

  /* Get the points of the user to get points from (source user) */
  const source = await findUserByID({ discordID: fromDiscordUserID, userUUID: fromUserUUID });
  if(! source)
    throw new NotEnoughPoints();

  const sourcePoints = await ObtainableService.getPoints({ userUUID: source }) || 0;

  /* Check if the source user has less points than the given amount. */
  if(! sourcePoints || sourcePoints < amount)
    throw new NotEnoughPoints();

  /* Get the points of user to add points to (target user). */
  const target = await findUserByID({
    discordID: toDiscordUserID,
    userUUID: toUserUUID,
    createIfNotExisting: true,
  });

  if(! target)
    throw new Error('Cannot transfer points');

  /* Add points to the target user. */
  const targetPoints = await ObtainableService.getPoints({ userUUID: target });
  if(! targetPoints)
    await ObtainableService.createObtainable({ userUUID: target, amount, discordGuildID });
  else
    await ObtainableService.updatePoints(target, targetPoints + amount);

  /* Subtract points from the source user. */
  await ObtainableService.updatePoints(source, sourcePoints - amount);
}
