class ContextUtilClass
{
  private contexts =
  {
    discord: 'discord',
    twitch: 'twitch',
  }

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

    const context = discordGuildID
      ? this.contexts.discord
      : this.contexts.twitch;

    return `${context}:${discordGuildID || twitchChannelID}`;
  }
}

export const ContextUtil = new ContextUtilClass();
