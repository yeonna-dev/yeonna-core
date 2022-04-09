export declare function sellDuplicateItems({ userIdentifier, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<{
    sellPrice: number;
    soldItems: import("../services/InventoriesService").InventoryItem[];
}>;
//# sourceMappingURL=sellDuplicateItems.d.ts.map