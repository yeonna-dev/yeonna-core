import { TimestampedRecord } from '../../../common/DB';
import { UsersFields } from './UsersService';
export declare enum ObtainableFields {
    user_id = "user_id",
    amount = "amount",
    is_collectible = "is_collectible",
    context = "context"
}
export interface ObtainableRecord extends TimestampedRecord {
    [ObtainableFields.user_id]: string;
    [ObtainableFields.amount]: number;
    [ObtainableFields.is_collectible]?: boolean;
    [ObtainableFields.context]?: string;
    [UsersFields.discord_id]?: string;
    [UsersFields.twitch_id]?: string;
}
export interface Obtainable {
    user: {
        id: string;
        discordId?: string;
        twitchId?: string;
    };
    amount: number;
    context?: string;
    isCollectible?: boolean;
}
export declare class ObtainableService {
    static find({ userId, isCollectible, context, }: {
        userId: string;
        isCollectible?: boolean;
        context?: string;
    }): Promise<number | undefined>;
    static create({ userId, amount, isCollectible, context, }: {
        userId: string;
        amount: number;
        isCollectible?: boolean;
        context?: string;
    }): Promise<Boolean>;
    static update({ userId, amount, isCollectible, context, }: {
        userId: string;
        amount: number;
        isCollectible?: boolean;
        context?: string;
    }): Promise<number | undefined>;
    static getTop({ count, isCollectible, context, }: {
        count: number;
        isCollectible?: boolean;
        context?: string;
    }): Promise<Obtainable[]>;
    static getTopWithUsers({ count, isCollectible, context, }: {
        count: number;
        isCollectible?: boolean;
        context?: string;
    }): Promise<Obtainable[]>;
    static serialize(obtainableRecord: ObtainableRecord): Obtainable;
}
