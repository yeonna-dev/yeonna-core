export declare function obtainRandomItem({ userIdentifier, discordGuildID, twitchChannelID, }: {
    userIdentifier: string;
    discordGuildID?: string;
    twitchChannelID?: string;
}): Promise<Item | undefined>;
