import { TimestampedRecord } from '../../../common/DB';
export declare enum UsersFields {
    id = "id",
    discord_id = "discord_id",
    twitch_id = "twitch_id",
    created_at = "created_at",
    updated_at = "updated_at",
    deleted_at = "deleted_at"
}
export interface UserRecord extends TimestampedRecord {
    id: string;
    discord_id: string | null;
    twitch_id: string | null;
}
export interface User {
    id: string;
    discordId?: string | null;
    twitchId?: string | null;
}
export declare class UsersService {
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
