import { InventoryItem } from '../services/InventoriesService';
export declare function sellAllItems({ userIdentifier, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<{
    sellPrice: number;
    soldItems: InventoryItem[];
}>;
export declare function sellDuplicateItems({ userIdentifier, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<{
    sellPrice: number;
    soldItems: InventoryItem[];
}>;
export declare function sellByCategory({ userIdentifier, category, discordGuildId, twitchChannelId, }: {
    userIdentifier: string;
    category: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<{
    sellPrice: number;
    soldItems: InventoryItem[];
}>;
//# sourceMappingURL=sell.d.ts.map