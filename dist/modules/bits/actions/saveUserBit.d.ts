export declare function saveUserBit({ userIdentifier, content, tags, discordGuildId, }: {
    userIdentifier: string;
    content: string;
    tags?: string[];
    discordGuildId?: string;
}): Promise<import("../services/UsersBitsService").UserBit>;
