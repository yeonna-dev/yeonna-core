declare type TopObtainables = {
    userID: string;
    discordID?: string | null;
    twitchID?: string | null;
    amount: number;
};
export declare function getTopObtainables({ count, isCollectible, discordGuildID, twitchChannelID, }: {
    count: number;
    isCollectible?: boolean;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<TopObtainables[]>;
export declare function getTopPoints({ count, discordGuildID, twitchChannelID, }: {
    count: number;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<TopObtainables[]>;
export declare function getTopCollectibles({ count, discordGuildID, twitchChannelID, }: {
    count: number;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<TopObtainables[]>;
export {};
