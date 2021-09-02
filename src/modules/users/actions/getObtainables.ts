import { findUser } from './findUser';

import { ObtainableService } from '../services/ObtainableService';

import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';

export async function getObtainables({
  userIdentifier,
  isCollectible,
  discordGuildID,
  twitchChannelID,
} : {
  userIdentifier: string,
  isCollectible?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  if(! discordGuildID && ! twitchChannelID)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  /* Check if the user is existing. */
  const userID = await findUser(userIdentifier);
  if(! userID )
    throw new UserNotFound();

  const obtainables = await ObtainableService.getObtainable({
    userID,
    isCollectible,
    context: ContextUtil.createContext({ discordGuildID, twitchChannelID }),
  });

  return obtainables || 0;
}

export async function getUserPoints({
  userIdentifier,
  discordGuildID,
  twitchChannelID,
} : {
  userIdentifier: string,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  return getObtainables({
    userIdentifier,
    discordGuildID,
    twitchChannelID,
  });
}

export async function getUserCollectibles({
  userIdentifier,
  discordGuildID,
  twitchChannelID,
} : {
  userIdentifier: string,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  return getObtainables({
    userIdentifier,
    isCollectible: true,
    discordGuildID,
    twitchChannelID,
  });
}
