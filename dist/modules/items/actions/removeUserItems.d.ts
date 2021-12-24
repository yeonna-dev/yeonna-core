export declare function removeUserItems({ userIdentifier, itemsToRemove, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    itemsToRemove: {
        code: string;
        amount: number;
    }[];
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<import("../services/InventoriesService").InventoryItem[]>;
