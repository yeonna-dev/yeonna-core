export declare function updateObtainables({ userIdentifier, amount, isCollectible, add, subtract, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    amount: number;
    isCollectible?: boolean;
    add?: boolean;
    subtract?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number | undefined>;
export declare function updatePoints({ userIdentifier, amount, add, subtract, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    amount: number;
    add?: boolean;
    subtract?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number | undefined>;
export declare function updateCollectibles({ userIdentifier, amount, add, subtract, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    amount: number;
    add?: boolean;
    subtract?: boolean;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<number | undefined>;
//# sourceMappingURL=updateObtainables.d.ts.map