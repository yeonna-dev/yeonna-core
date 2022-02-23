import { findOrCreateUser } from './findUser';

import { ObtainableService } from '../services/ObtainableService';

import { ContextUtil } from '../../../common/ContextUtil';

export async function updateObtainables({
  userIdentifier,
  amount,
  isCollectible,
  add,
  subtract,
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  amount: number,
  isCollectible?: boolean,
  add?: boolean,
  subtract?: boolean,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  if(!discordGuildId && !twitchChannelId)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  amount = Math.abs(amount);

  const userId = await findOrCreateUser({ userIdentifier, discordGuildId, twitchChannelId });
  if(!userId)
    throw new Error('Cannot update user points');

  /* Check if the user's obtainable record is already created. */
  const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });
  const obtainables = await ObtainableService.find({
    userId,
    isCollectible,
    context,
  });

  /* Create the obtainable record if not existing. */
  if(obtainables === undefined)
    await ObtainableService.create({
      userId,
      amount,
      isCollectible,
      context,
    });
  else
  {
    let newPoints = amount;
    if(add)
      newPoints = obtainables + amount;
    if(subtract)
      newPoints = obtainables - amount;

    return ObtainableService.update({
      userId,
      amount: newPoints,
      isCollectible,
      context,
    });
  }
}

export async function updatePoints({
  userIdentifier,
  amount,
  add,
  subtract,
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  amount: number,
  add?: boolean,
  subtract?: boolean,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  return updateObtainables({
    userIdentifier,
    amount,
    add,
    subtract,
    discordGuildId,
    twitchChannelId,
  });
}

export async function updateCollectibles({
  userIdentifier,
  amount,
  add,
  subtract,
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  amount: number,
  add?: boolean,
  subtract?: boolean,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  return updateObtainables({
    userIdentifier,
    amount,
    isCollectible: true,
    add,
    subtract,
    discordGuildId,
    twitchChannelId,
  });
}
