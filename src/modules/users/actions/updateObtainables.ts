import { findOrCreateUser } from './findUser';

import { ObtainableService } from '../services/ObtainableService';

import { ContextPlatforms, ContextUtil } from '../../../common/ContextUtil';

export async function updateObtainables({
  userIdentifier,
  amount,
  isCollectible,
  add,
  subtract,
  discordGuildID,
  twitchChannelID,
}: {
  userIdentifier: string,
  amount: number,
  isCollectible?: boolean,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  if(!discordGuildID && !twitchChannelID)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  amount = Math.abs(amount);

  const userID = await findOrCreateUser({ userIdentifier, discordGuildID, twitchChannelID });
  if(!userID)
    throw new Error('Cannot update user points');

  /* Check if the user's obtainable record is already created. */
  const context = ContextUtil.createContext({ discordGuildID, twitchChannelID });
  const obtainables = await ObtainableService.find({
    userID,
    isCollectible,
    context,
  });

  /* Create the obtainable record if not existing. */
  if(obtainables === undefined)
    await ObtainableService.create({
      userID,
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
      userID,
      amount: newPoints,
      isCollectible,
      context,
    });
  }
}

export async function updateUserPoints({
  userIdentifier,
  amount,
  add,
  subtract,
  discordGuildID,
  twitchChannelID,
}: {
  userIdentifier: string,
  amount: number,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  return updateObtainables({
    userIdentifier,
    amount,
    add,
    subtract,
    discordGuildID,
    twitchChannelID,
  });
}

export async function updateUserCollectibles({
  userIdentifier,
  amount,
  add,
  subtract,
  discordGuildID,
  twitchChannelID,
}: {
  userIdentifier: string,
  amount: number,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  return updateObtainables({
    userIdentifier,
    amount,
    isCollectible: true,
    add,
    subtract,
    discordGuildID,
    twitchChannelID,
  });
}
