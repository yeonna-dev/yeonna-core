import { TimestampedRecord } from '../../../common/DB';
export declare enum ItemField {
    code = "code",
    name = "name",
    chance_min = "chance_min",
    chance_max = "chance_max",
    price = "price",
    image = "image",
    emote = "emote",
    context = "context",
    category_id = "category_id"
}
export interface ItemRecord extends TimestampedRecord {
    [ItemField.code]: string;
    [ItemField.name]: string;
    [ItemField.chance_min]?: number;
    [ItemField.chance_max]?: number;
    [ItemField.price]?: number;
    [ItemField.image]?: string;
    [ItemField.emote]?: string;
    [ItemField.category_id]?: string;
}
export interface Item {
    code: string;
    name: string;
    chanceMin?: number;
    chanceMax?: number;
    price?: number;
    image?: string;
    emote?: string;
    categoryId?: string;
}
export declare class ItemService {
    static table: string;
    static find({ code, chance, }: {
        code?: string;
        chance?: number;
    }): Promise<Item[]>;
    static findRandom(chance: number, context?: string): Promise<Item | undefined>;
    static findByCodes(codes: string[]): Promise<Item[]>;
    static serialize(item: ItemRecord): Item;
}
//# sourceMappingURL=ItemService.d.ts.map