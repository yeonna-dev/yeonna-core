export declare function getObtainables({ userIdentifier, isCollectible, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    isCollectible?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number>;
export declare function getPoints({ userIdentifier, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number>;
export declare function getCollectibles({ userIdentifier, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number>;
//# sourceMappingURL=getObtainables.d.ts.map