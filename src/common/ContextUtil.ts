export enum ContextPlatform
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

    const platform = discordGuildId ? ContextPlatform.Discord : ContextPlatform.Twitch;
    return `${platform}:${discordGuildId || twitchChannelId}`;
  }
}
