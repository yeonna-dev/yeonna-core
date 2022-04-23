export interface Identifiers
{
  userIdentifier: string,
  discordGuildId?: string,
  twitchChannelId?: string,
}

type ActionWithUserAndContext<T> = (userId: string, context?: string) => Promise<T>;
export type UserAndContextProvider = <T>(
  callback: ActionWithUserAndContext<T>,
  options?: { createNonexistentUser?: boolean; }
) => ReturnType<typeof callback>;

export type ItemsWithCodeAndAmount =
  {
    code: string,
    amount: number,
  }[];
