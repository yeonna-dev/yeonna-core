import { findUserByID } from './findUserByID';

import { ObtainableService } from '../services/ObtainableService';

import { NotEnoughPoints } from '../../../common/errors';
import { getObtainables } from './getObtainables';

export async function transferObtainables({
  fromUserUUID,
  fromDiscordUserID,
  toUserUUID,
  toDiscordUserID,
  amount,
  isCollectible,
  discordGuildID,
} : {
  fromUserUUID?: string,
  fromDiscordUserID?: string,
  toUserUUID?: string,
  toDiscordUserID?: string,
  amount: number,
  isCollectible?: boolean,
  discordGuildID?: string,
}): Promise<void>
{
  amount = Math.abs(amount);

  /* Get the obtainables of the user to get obtainables from (source user) */
  const source = await findUserByID({ discordID: fromDiscordUserID, userUUID: fromUserUUID });
  if(! source)
    throw new NotEnoughPoints();

  const sourceObtainables = await getObtainables({ userUUID: source, isCollectible });

  /* Check if the source user has less obtainables than the given amount. */
  if(! sourceObtainables || sourceObtainables < amount)
    throw new NotEnoughPoints();

  /* Get the obtainables of user to add obtainables to (target user). */
  const target = await findUserByID({
    discordID: toDiscordUserID,
    userUUID: toUserUUID,
    createIfNotExisting: true,
  });

  if(! target)
    throw new Error('Cannot transfer points');

  /* Add obtainables to the target user. */
  const targetObtainables = await getObtainables({ userUUID: target, isCollectible });
  if(! targetObtainables)
    await ObtainableService.createObtainable({
      userUUID: target,
      amount,
      discordGuildID,
      isCollectible,
    });
  else
    await ObtainableService.updateObtainables(target, targetObtainables + amount, isCollectible);

  /* Subtract obtainables from the source user. */
  await ObtainableService.updateObtainables(source, sourceObtainables - amount, isCollectible);
}
