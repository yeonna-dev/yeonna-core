import { TimestampedRecord } from '../../../common/DB';
export declare enum ObtainableFields {
    user_id = "user_id",
    amount = "amount",
    is_collectible = "is_collectible",
    context = "context",
    created_at = "created_at",
    updated_at = "updated_at",
    deleted_at = "deleted_at"
}
export interface ObtainableRecord extends TimestampedRecord {
    user_id: string;
    amount: number;
    context?: string;
    is_collectible?: boolean;
}
export interface Obtainable {
    userId: string;
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
    static serialize(obtainableRecord: ObtainableRecord): Obtainable;
}
