export type ContextParameters = {
  discordGuildId?: string;
  twitchChannelId?: string;
};

export type Identifiers = ContextParameters & {
  userIdentifier: string;
};

type ActionWithContext<T> = (context?: string) => Promise<T>;
type ContextProviderOptions = {
  requireContextParameters?: boolean;
};

export type ContextProvider = <T>(
  callback: ActionWithContext<T>,
  options?: ContextProviderOptions,
) => ReturnType<typeof callback>;

type ActionWithUserAndContext<T> = (userId: string, context?: string) => Promise<T>;
type UserAndContextProviderOptions = ContextProviderOptions & {
  createNonexistentUser?: boolean;
  silentErrors?: boolean;
};

export type UserAndContextProvider = <T>(
  callback: ActionWithUserAndContext<T>,
  options?: UserAndContextProviderOptions
) => ReturnType<typeof callback>;

export type ItemsWithCodeAndAmount = {
  code: string;
  amount: number;
}[];
