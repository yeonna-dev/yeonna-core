import { findUserByID } from './findUserByID';

import { ObtainableService } from '../services/ObtainableService';

import { NotEnoughCollectibles, NotEnoughPoints } from '../../../common/errors';
import { getObtainables } from './getObtainables';

export async function transferObtainables({
  fromUserUUID,
  fromDiscordUserID,
  fromTwitchUserID,
  toUserUUID,
  toDiscordUserID,
  toTwitchUserID,
  amount,
  isCollectible,
  discordGuildID,
  twitchChannelID,
} : {
  fromUserUUID?: string,
  fromDiscordUserID?: string,
  fromTwitchUserID?: string,
  toUserUUID?: string,
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
  const source = await findUserByID({
    discordID: fromDiscordUserID,
    twitchID: fromTwitchUserID,
    userUUID: fromUserUUID,
  });
  if(! source)
    throw new (isCollectible ? NotEnoughCollectibles : NotEnoughPoints)();

  const sourceObtainables = await getObtainables({
    userUUID: source,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  });

  /* Check if the source user has less obtainables than the given amount. */
  if(! sourceObtainables || sourceObtainables < amount)
    throw new (isCollectible ? NotEnoughCollectibles : NotEnoughPoints)();

  /* Get the obtainables of user to add obtainables to (target user). */
  const target = await findUserByID({
    discordID: toDiscordUserID,
    twitchID: toTwitchUserID,
    userUUID: toUserUUID,
    createIfNotExisting: true,
  });

  if(! target)
    throw new Error('Cannot transfer points');

  /* Add obtainables to the target user. */
  const targetObtainables = await getObtainables({
    userUUID: target,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  });

  if(! targetObtainables)
    await ObtainableService.createObtainable({
      userUUID: target,
      amount,
      discordGuildID,
      twitchChannelID,
      isCollectible,
    });
  else
    await ObtainableService.updateObtainables({
      userUUID: target,
      amount: targetObtainables + amount,
      isCollectible,
      discordGuildID,
      twitchChannelID,
    });

  /* Subtract obtainables from the source user. */
  await ObtainableService.updateObtainables({
    userUUID: source,
    amount: sourceObtainables - amount,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  });
}

export async function transferUserPoints({
  fromUserUUID,
  fromDiscordUserID,
  fromTwitchUserID,
  toUserUUID,
  toDiscordUserID,
  toTwitchUserID,
  amount,
  discordGuildID,
  twitchChannelID,
} : {
  fromUserUUID?: string,
  fromDiscordUserID?: string,
  fromTwitchUserID?: string,
  toUserUUID?: string,
  toDiscordUserID?: string,
  toTwitchUserID?: string,
  amount: number,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<void>
{
  await transferObtainables({
    fromUserUUID,
    fromDiscordUserID,
    fromTwitchUserID,
    toUserUUID,
    toDiscordUserID,
    toTwitchUserID,
    amount,
    discordGuildID,
    twitchChannelID,
  });
}

export async function transferUserCollectibles({
  fromUserUUID,
  fromDiscordUserID,
  fromTwitchUserID,
  toUserUUID,
  toDiscordUserID,
  toTwitchUserID,
  amount,
  discordGuildID,
  twitchChannelID,
} : {
  fromUserUUID?: string,
  fromDiscordUserID?: string,
  fromTwitchUserID?: string,
  toUserUUID?: string,
  toDiscordUserID?: string,
  toTwitchUserID?: string,
  amount: number,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<void>
{
  await transferObtainables({
    fromUserUUID,
    fromDiscordUserID,
    fromTwitchUserID,
    toUserUUID,
    toDiscordUserID,
    toTwitchUserID,
    amount,
    discordGuildID,
    twitchChannelID,
    isCollectible: true,
  });
}
