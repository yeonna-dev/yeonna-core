export const ContextPlatforms =
{
  Discord: 'discord',
  Twitch: 'twitch',
}

class ContextUtilClass
{
  createContext({
    discordGuildID,
    twitchChannelID,
  } : {
    discordGuildID?: string,
    twitchChannelID?: string,
  })
  {
    if(! discordGuildID && ! twitchChannelID)
      return;

    const platform = discordGuildID ? ContextPlatforms.Discord : ContextPlatforms.Twitch;
    return `${platform}:${discordGuildID || twitchChannelID}`;
  }
}

export const ContextUtil = new ContextUtilClass();
