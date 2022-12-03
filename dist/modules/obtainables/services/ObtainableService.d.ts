import { TimestampedRecord } from '../../../common/DB';
import { UserField } from '../../users/services/UserService';
export declare enum ObtainableField {
    user_id = "user_id",
    amount = "amount",
    is_collectible = "is_collectible",
    context = "context"
}
export interface ObtainableRecord extends TimestampedRecord {
    [ObtainableField.user_id]: string;
    [ObtainableField.amount]: number;
    [ObtainableField.is_collectible]?: boolean;
    [ObtainableField.context]?: string;
    [UserField.discord_id]?: string;
    [UserField.twitch_id]?: string;
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