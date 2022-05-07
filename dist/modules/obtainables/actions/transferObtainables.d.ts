declare type TransferObtainablesParameters = {
    fromUserIdentifier: string;
    toUserIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
    amount: number;
    isCollectible?: boolean;
};
export declare const transferObtainables: ({ fromUserIdentifier, toUserIdentifier, discordGuildId, twitchChannelId, amount, isCollectible, }: TransferObtainablesParameters) => Promise<void>;
export declare const transferUserPoints: (parameters: Omit<TransferObtainablesParameters, 'isCollectible'>) => Promise<void>;
export declare const transferUserCollectibles: (parameters: Omit<TransferObtainablesParameters, 'isCollectible'>) => Promise<void>;
export {};
//# sourceMappingURL=transferObtainables.d.ts.map