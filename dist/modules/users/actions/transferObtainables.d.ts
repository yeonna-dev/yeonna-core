export declare function transferObtainables({ fromUserIdentifier, toUserIdentifier, amount, isCollectible, discordGuildId, twitchChannelId, }: {
    fromUserIdentifier: string;
    toUserIdentifier: string;
    amount: number;
    isCollectible?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<void>;
export declare function transferUserPoints({ fromUserIdentifier, toUserIdentifier, amount, discordGuildId, twitchChannelId, }: {
    fromUserIdentifier: string;
    toUserIdentifier: string;
    amount: number;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<void>;
export declare function transferUserCollectibles({ fromUserIdentifier, toUserIdentifier, amount, discordGuildId, twitchChannelId, }: {
    fromUserIdentifier: string;
    toUserIdentifier: string;
    amount: number;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<void>;
