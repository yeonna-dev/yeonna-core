export declare function findUser(userIdentifier: string): Promise<string>;
export declare function findOrCreateUser({ userIdentifier, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<any>;
