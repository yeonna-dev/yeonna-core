import { TimestampedRecord } from '../../../common/DB';
export declare enum UserField {
    id = "id",
    discord_id = "discord_id",
    twitch_id = "twitch_id"
}
export interface UserRecord extends TimestampedRecord {
    [UserField.id]: string;
    [UserField.discord_id]?: string;
    [UserField.twitch_id]?: string;
}
export interface User {
    id: string;
    discordId?: string;
    twitchId?: string;
}
export declare class UserService {
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
//# sourceMappingURL=UserService.d.ts.map