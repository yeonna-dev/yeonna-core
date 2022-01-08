import { TimestampedRecord } from '../../../common/DB';
export declare enum ItemsFields {
    code = "code",
    name = "name",
    chance_min = "chance_min",
    chance_max = "chance_max",
    price = "price",
    image = "image",
    emote = "emote",
    category_id = "category_id"
}
export interface ItemRecord extends TimestampedRecord {
    [ItemsFields.code]: string;
    [ItemsFields.name]: string;
    [ItemsFields.chance_min]?: number;
    [ItemsFields.chance_max]?: number;
    [ItemsFields.price]?: number;
    [ItemsFields.image]?: string;
    [ItemsFields.emote]?: string;
    [ItemsFields.category_id]?: string;
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
export declare class ItemsService {
    static table: string;
    static find({ code, chance, }: {
        code?: string;
        chance?: number;
    }): Promise<Item[]>;
    static findRandom({ code, chance, }: {
        code?: string;
        chance?: number;
    }): Promise<Item | undefined>;
    static findByCodes(codes: string[]): Promise<Item[]>;
    static serialize(item: ItemRecord): Item;
}
//# sourceMappingURL=ItemsService.d.ts.map