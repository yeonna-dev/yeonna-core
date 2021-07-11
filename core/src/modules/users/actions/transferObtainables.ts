import { findUser, findOrCreateUser } from './findUser';
import { getObtainables } from './getObtainables';

import { ObtainableService } from '../services/ObtainableService';

import { ContextUtil } from '../../../common/ContextUtil';
import { NotEnoughCollectibles, NotEnoughPoints } from '../../../common/errors';

export async function transferObtainables({
  fromUserIdentifier,
  toUserID,
  toDiscordUserID,
  toTwitchUserID,
  amount,
  isCollectible,
  discordGuildID,
  twitchChannelID,
} : {
  fromUserIdentifier: string,
  toUserID?: string,
  toDiscordUserID?: string,
  toTwitchUserID?: string,
  amount: number,
  isCollectible?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<void>
{
  if(! discordGuildID && ! twitchChannelID)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  amount = Math.abs(amount);

  /* Get the obtainables of the user to get obtainables from (source user) */
  const source = await findUser(fromUserIdentifier);
  if(! source)
    throw new (isCollectible ? NotEnoughCollectibles : NotEnoughPoints)();

  const sourceObtainables = await getObtainables({
    userIdentifier: source,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  });

  /* Check if the source user has less obtainables than the given amount. */
  if(! sourceObtainables || sourceObtainables < amount)
    throw new (isCollectible ? NotEnoughCollectibles : NotEnoughPoints)();

  /* Get the obtainables of user to add obtainables to (target user). */
  const target = await findOrCreateUser({
    discordID: toDiscordUserID,
    twitchID: toTwitchUserID,
    userID: toUserID,
  });

  if(! target)
    throw new Error('Cannot transfer points');

  /* Add obtainables to the target user. */
  const targetObtainables = await getObtainables({
    userIdentifier: target,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  });

  const context = ContextUtil.createContext({ discordGuildID, twitchChannelID });
  if(! targetObtainables)
    await ObtainableService.createObtainable({
      userID: target,
      amount,
      isCollectible,
      context,
    });
  else
    await ObtainableService.updateObtainables({
      userID: target,
      amount: targetObtainables + amount,
      isCollectible,
      context,
    });

  /* Subtract obtainables from the source user. */
  await ObtainableService.updateObtainables({
    userID: source,
    amount: sourceObtainables - amount,
    isCollectible,
    context,
  });
}

export async function transferUserPoints({
  fromUserIdentifier,
  toUserID,
  toDiscordUserID,
  toTwitchUserID,
  amount,
  discordGuildID,
  twitchChannelID,
} : {
  fromUserIdentifier: string,
  toUserID?: string,
  toDiscordUserID?: string,
  toTwitchUserID?: string,
  amount: number,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<void>
{
  await transferObtainables({
    fromUserIdentifier,
    toUserID,
    toDiscordUserID,
    toTwitchUserID,
    amount,
    discordGuildID,
    twitchChannelID,
  });
}

export async function transferUserCollectibles({
  fromUserIdentifier,
  toUserID,
  toDiscordUserID,
  toTwitchUserID,
  amount,
  discordGuildID,
  twitchChannelID,
} : {
  fromUserIdentifier: string,
  toUserID?: string,
  toDiscordUserID?: string,
  toTwitchUserID?: string,
  amount: number,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<void>
{
  await transferObtainables({
    fromUserIdentifier,
    toUserID,
    toDiscordUserID,
    toTwitchUserID,
    amount,
    discordGuildID,
    twitchChannelID,
    isCollectible: true,
  });
}
