export declare function transferObtainables({ fromUserIdentifier, toUserIdentifier, amount, isCollectible, discordGuildID, twitchChannelID, }: {
    fromUserIdentifier: string;
    toUserIdentifier: string;
    amount: number;
    isCollectible?: boolean;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<void>;
export declare function transferUserPoints({ fromUserIdentifier, toUserIdentifier, amount, discordGuildID, twitchChannelID, }: {
    fromUserIdentifier: string;
    toUserIdentifier: string;
    amount: number;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<void>;
export declare function transferUserCollectibles({ fromUserIdentifier, toUserIdentifier, amount, discordGuildID, twitchChannelID, }: {
    fromUserIdentifier: string;
    toUserIdentifier: string;
    amount: number;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<void>;
