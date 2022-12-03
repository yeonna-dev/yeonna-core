import { TimestampedRecord } from '../../../common/DB';
import { ItemField } from './ItemService';
export declare enum InventoryField {
    user_id = "user_id",
    item_code = "item_code",
    user_id_item_code = "user_id_item_code",
    amount = "amount",
    context = "context"
}
declare const categoryNameAlias = "category_name";
export interface InventoryRecord extends TimestampedRecord {
    [InventoryField.user_id]: string;
    [InventoryField.item_code]: string;
    [InventoryField.user_id_item_code]: string;
    [InventoryField.amount]: number;
    [InventoryField.context]?: string;
    [ItemField.code]?: string;
    [ItemField.name]?: string;
    [ItemField.chance_min]?: number;
    [ItemField.chance_max]?: number;
    [ItemField.price]?: number;
    [ItemField.image]?: string;
    [ItemField.emote]?: string;
    [ItemField.category_id]?: string;
    [categoryNameAlias]?: string;
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
    category?: string;
}
export declare class InventoryService {
    static table: string;
    static getUserItems({ userId, context, category, }: {
        userId: string;
        context?: string;
        category?: string;
    }): Promise<InventoryItem[]>;
    static updateOrCreateUserItems({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            amount?: number;
        }[];
        context?: string;
    }): Promise<InventoryItem[]>;
    static addUserItems({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            amount?: number;
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
            amount?: number;
        }[];
        context?: string;
    }): Promise<InventoryItem[]>;
    static serialize(userItem: InventoryRecord): InventoryItem;
}
export {};
//# sourceMappingURL=InventoryService.d.ts.map