import { TimestampedRecord } from '../../../common/DB';
export declare enum InventoriesFields {
    user_id = "user_id",
    item_code = "item_code",
    user_id_item_code = "user_id_item_code",
    amount = "amount",
    context = "context"
}
export interface InventoryRecord extends TimestampedRecord {
    user_id: string;
    item_code: string;
    user_id_item_code: string;
    amount: number;
    context?: string;
    code?: string;
    name?: string;
    chance_min?: number;
    chance_max?: number;
    price?: number;
    image?: string;
    emote?: string;
    category_id?: string;
}
export interface InventoryItem {
    amount: number;
    context?: string;
    code: string;
    name?: string;
    chanceMin?: number;
    chanceMax?: number;
    price?: number;
    image?: string;
    emote?: string;
    categoryId?: string;
}
export declare class InventoriesService {
    static getUserItems(userId: string, context?: string): Promise<InventoryItem[]>;
    static updateOrCreateUserItems({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            amount: number;
        }[];
        context?: string;
    }): Promise<InventoryItem[]>;
    static addUserItems({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            amount: number;
        }[];
        context?: string;
    }): Promise<InventoryItem[]>;
    static removeUserItem({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            amount: number;
        }[];
        context?: string;
    }): Promise<InventoryItem[]>;
    static updateUserItemAmounts({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            addAmount?: number;
            subtractAmount?: number;
        }[];
        context?: string;
    }): Promise<InventoryItem[]>;
    static serialize(userItem: InventoryRecord): InventoryItem;
}
