import { findUser } from './findUser';

import { ObtainableService } from '../services/ObtainableService';

import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';

export async function getObtainables({
  userIdentifier,
  isCollectible,
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  isCollectible?: boolean,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  if(!discordGuildId && !twitchChannelId)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  /* Check if the user is existing. */
  const userId = await findUser(userIdentifier);
  if(!userId)
    throw new UserNotFound();

  const obtainables = await ObtainableService.find({
    userId,
    isCollectible,
    context: ContextUtil.createContext({ discordGuildId, twitchChannelId }),
  });

  return obtainables || 0;
}

export async function getUserPoints({
  userIdentifier,
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  return getObtainables({
    userIdentifier,
    discordGuildId,
    twitchChannelId,
  });
}

export async function getUserCollectibles({
  userIdentifier,
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  return getObtainables({
    userIdentifier,
    isCollectible: true,
    discordGuildId,
    twitchChannelId,
  });
}
