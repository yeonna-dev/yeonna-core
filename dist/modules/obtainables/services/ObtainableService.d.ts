import { TimestampedRecord } from '../../../common/DB';
import { UsersFields } from '../../users/services/UsersService';
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
declare type CommonParams = {
    isCollectible?: boolean;
    context?: string;
};
export declare class ObtainableService {
    static find({ userId, isCollectible, context, }: {
        userId: string;
    } & CommonParams): Promise<number | undefined>;
    static getTop({ count, isCollectible, context, withUsers, }: {
        count: number;
        withUsers?: boolean;
    } & CommonParams): Promise<Obtainable[]>;
    static create({ userId, amount, isCollectible, context, }: {
        userId: string;
        amount: number;
    } & CommonParams): Promise<Boolean>;
    static update({ userId, amount, addAmount, isCollectible, context, }: {
        userId: string;
        amount?: number;
        addAmount?: number;
    } & CommonParams): Promise<number | undefined>;
    static reset({ isCollectible, context, }: CommonParams): Promise<Obtainable[]>;
    static serialize(obtainableRecord: ObtainableRecord): Obtainable;
}
export {};
//# sourceMappingURL=ObtainableService.d.ts.map