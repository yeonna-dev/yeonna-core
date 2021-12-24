export declare function findUser(userIdentifier: string): Promise<string>;
export declare function findOrCreateUser({ userIdentifier, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<any>;
