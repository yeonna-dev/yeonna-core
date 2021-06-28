import { ObtainableService } from '../services/ObtainableService';
import { findUserByID } from './findUserByID';

export async function getObtainables({
  userUUID,
  discordID,
  twitchID,
  isCollectible,
  discordGuildID,
  twitchChannelID,
} : {
  userUUID?: string,
  discordID?: string,
  twitchID?: string,
  isCollectible?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  if(! discordGuildID && ! twitchChannelID)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  /* Check if the user is existing. */
  userUUID = await findUserByID({ userUUID, discordID, twitchID });

  return ! userUUID ? 0 : ObtainableService.getObtainable({
    userUUID,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  });
}

export async function getUserPoints({
  userUUID,
  discordID,
  twitchID,
  discordGuildID,
  twitchChannelID,
} : {
  userUUID?: string,
  discordID?: string,
  twitchID?: string,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  return getObtainables({ userUUID, discordID, twitchID, discordGuildID, twitchChannelID });
}

export async function getUserCollectibles({
  userUUID,
  discordID,
  twitchID,
  discordGuildID,
  twitchChannelID,
} : {
  userUUID?: string,
  discordID?: string,
  twitchID?: string,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  return getObtainables({
    userUUID,
    discordID,
    twitchID,
    isCollectible: true,
    discordGuildID,
    twitchChannelID,
  });
}
