declare type TopObtainables = {
    userId: string;
    discordId?: string | null;
    twitchId?: string | null;
    amount: number;
};
export declare function getTopObtainables({ count, isCollectible, discordGuildId, twitchChannelId, }: {
    count: number;
    isCollectible?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<TopObtainables[]>;
export declare function getTopPoints({ count, discordGuildId, twitchChannelId, }: {
    count: number;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<TopObtainables[]>;
export declare function getTopCollectibles({ count, discordGuildId, twitchChannelId, }: {
    count: number;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<TopObtainables[]>;
export {};
