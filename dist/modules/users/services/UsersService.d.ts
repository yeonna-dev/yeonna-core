import { TimestampedRecord } from '../../../common/DB';
export declare enum UsersFields {
    id = "id",
    discord_id = "discord_id",
    twitch_id = "twitch_id"
}
export interface UserRecord extends TimestampedRecord {
    [UsersFields.id]: string;
    [UsersFields.discord_id]?: string;
    [UsersFields.twitch_id]?: string;
}
export interface User {
    id: string;
    discordId?: string;
    twitchId?: string;
}
export declare class UsersService {
    static table: string;
    static create({ discordId, twitchId, }?: {
        discordId?: string;
        twitchId?: string;
    }): Promise<string>;
    static findById(ids: string | string[]): Promise<User[]>;
    static find({ ids, discordIds, twitchIds, }: {
        ids?: string | string[];
        discordIds?: string | string[];
        twitchIds?: string | string[];
    }): Promise<User[]>;
    static updateById(id: string, { discordId, twitchId }: {
        discordId?: string;
        twitchId?: string;
    }): Promise<void>;
}
