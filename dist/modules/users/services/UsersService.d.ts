export declare enum UsersFields {
    id = "id",
    discord_id = "discord_id",
    twitch_id = "twitch_id",
    created_at = "created_at",
    updated_at = "updated_at",
    deleted_at = "deleted_at"
}
export declare const UsersService: {
    create({ discordID, twitchID, }?: {
        discordID?: string | undefined;
        twitchID?: string | undefined;
    }): Promise<string>;
    findByID(ids: string | string[]): Promise<User[]>;
    find({ ids, discordIDs, twitchIDs, }: {
        ids?: string | string[] | undefined;
        discordIDs?: string | string[] | undefined;
        twitchIDs?: string | string[] | undefined;
    }): Promise<User[]>;
    updateByID(id: string, { discordID, twitchID }: {
        discordID?: string | undefined;
        twitchID?: string | undefined;
    }): Promise<void>;
};
