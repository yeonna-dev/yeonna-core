export declare function getObtainables({ userIdentifier, isCollectible, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    isCollectible?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number>;
export declare function getUserPoints({ userIdentifier, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number>;
export declare function getUserCollectibles({ userIdentifier, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number>;
