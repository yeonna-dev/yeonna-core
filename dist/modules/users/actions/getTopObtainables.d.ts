declare type TopPoints = {
    userID: string;
    discordID?: string | null;
    twitchID?: string | null;
    points: number;
};
export declare function getTopObtainables({ count, isCollectible, discordGuildID, twitchChannelID, }: {
    count: number;
    isCollectible?: boolean;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<TopPoints[]>;
export declare function getTopPoints({ count, discordGuildID, twitchChannelID, }: {
    count: number;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<TopPoints[]>;
export declare function getTopCollectibles({ count, discordGuildID, twitchChannelID, }: {
    count: number;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<TopPoints[]>;
export {};
