export declare function getObtainables({ userIdentifier, isCollectible, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    isCollectible?: boolean;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<number>;
export declare function getUserPoints({ userIdentifier, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<number>;
export declare function getUserCollectibles({ userIdentifier, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<number>;
