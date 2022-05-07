export type ContextParameters = {
  discordGuildId?: string;
  twitchChannelId?: string;
};

export type Identifiers = ContextParameters & {
  userIdentifier: string;
};

type ActionWithUser<T> = (userId: string, context?: string) => Promise<T | undefined>;
type UserProviderOptions = {
  createNonexistentUser?: boolean;
  silentErrors?: boolean;
};

export type UserProvider = <T>(
  callback: ActionWithUser<T>,
  options?: UserProviderOptions,
) => ReturnType<typeof callback>;

type ActionWithContext<T> = (context?: string) => Promise<T | undefined>;
type ContextProviderOptions = {
  requireContextParameters?: boolean;
};

export type ContextProvider = <T>(
  callback: ActionWithContext<T>,
  options?: ContextProviderOptions,
) => ReturnType<typeof callback>;

type ActionWithUserAndContext<T> = (userId: string, context?: string) => Promise<T | undefined>;
type UserAndContextProviderOptions = ContextProviderOptions & UserProviderOptions;

export type UserAndContextProvider = <T>(
  callback: ActionWithUserAndContext<T>,
  options?: UserAndContextProviderOptions,
) => ReturnType<typeof callback>;

export type ItemsWithCodeAndAmount = {
  code: string;
  amount: number;
}[];
