export declare function getUserItems({ userIdentifier, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<Inventory[]>;
