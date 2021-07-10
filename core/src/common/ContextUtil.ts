class ContextUtilClass
{
  private contexts =
  {
    discord: 'discord',
    twitch: 'twitch',
  }

  private createContext = (contextName: string, contextIdentifier: string) =>
    `${contextName}:${contextIdentifier}`

  discordContext = (discordGuildID: string) =>
    this.createContext(this.contexts.discord, discordGuildID)

  twitchContext = (twitchChannelID: string) =>
    this.createContext(this.contexts.twitch, twitchChannelID)
}

export const ContextUtil = new ContextUtilClass();
