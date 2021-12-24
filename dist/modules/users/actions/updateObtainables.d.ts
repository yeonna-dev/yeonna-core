export declare function updateObtainables({ userIdentifier, amount, isCollectible, add, subtract, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    amount: number;
    isCollectible?: boolean;
    add?: boolean;
    subtract?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number | undefined>;
export declare function updateUserPoints({ userIdentifier, amount, add, subtract, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    amount: number;
    add?: boolean;
    subtract?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number | undefined>;
export declare function updateUserCollectibles({ userIdentifier, amount, add, subtract, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    amount: number;
    add?: boolean;
    subtract?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number | undefined>;
