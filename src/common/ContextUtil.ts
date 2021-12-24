export enum ContextPlatforms
{
  Discord = 'discord',
  Twitch = 'twitch',
}

export class ContextUtil
{
  static createContext({
    discordGuildId,
    twitchChannelId,
  }: {
    discordGuildId?: string,
    twitchChannelId?: string,
  })
  {
    if(!discordGuildId && !twitchChannelId)
      return;

    const platform = discordGuildId ? ContextPlatforms.Discord : ContextPlatforms.Twitch;
    return `${platform}:${discordGuildId || twitchChannelId}`;
  }
}
