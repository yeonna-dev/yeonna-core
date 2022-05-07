export declare type ContextParameters = {
    discordGuildId?: string;
    twitchChannelId?: string;
};
export declare type Identifiers = ContextParameters & {
    userIdentifier: string;
};
declare type ActionWithUser<T> = (userId: string, context?: string) => Promise<T | undefined>;
declare type UserProviderOptions = {
    createNonexistentUser?: boolean;
    silentErrors?: boolean;
};
export declare type UserProvider = <T>(callback: ActionWithUser<T>, options?: UserProviderOptions) => ReturnType<typeof callback>;
declare type ActionWithContext<T> = (context?: string) => Promise<T | undefined>;
declare type ContextProviderOptions = {
    requireContextParameters?: boolean;
};
export declare type ContextProvider = <T>(callback: ActionWithContext<T>, options?: ContextProviderOptions) => ReturnType<typeof callback>;
declare type ActionWithUserAndContext<T> = (userId: string, context?: string) => Promise<T | undefined>;
declare type UserAndContextProviderOptions = ContextProviderOptions & UserProviderOptions;
export declare type UserAndContextProvider = <T>(callback: ActionWithUserAndContext<T>, options?: UserAndContextProviderOptions) => ReturnType<typeof callback>;
export declare type ItemsWithCodeAndAmount = {
    code: string;
    amount: number;
}[];
export {};
//# sourceMappingURL=types.d.ts.map