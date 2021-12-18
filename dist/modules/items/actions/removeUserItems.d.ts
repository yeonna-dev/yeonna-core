export declare function removeUserItems({ userIdentifier, itemsToRemove, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    itemsToRemove: {
        code: string;
        amount: number;
    }[];
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<any[]>;
