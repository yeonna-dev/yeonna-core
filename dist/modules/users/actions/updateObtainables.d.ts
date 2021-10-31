export declare function updateObtainables({ userIdentifier, amount, isCollectible, add, subtract, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    amount: number;
    isCollectible?: boolean;
    add?: boolean;
    subtract?: boolean;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<number | undefined>;
export declare function updateUserPoints({ userIdentifier, amount, add, subtract, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    amount: number;
    add?: boolean;
    subtract?: boolean;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<number | undefined>;
export declare function updateUserCollectibles({ userIdentifier, amount, add, subtract, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    amount: number;
    add?: boolean;
    subtract?: boolean;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<number | undefined>;
