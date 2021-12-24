import { TimestampedRecord } from '../../../common/DB';
export declare enum ItemsFields {
    category_id = "category_id",
    code = "code",
    name = "name",
    chance_min = "chance_min",
    chance_max = "chance_max",
    price = "price",
    image = "image",
    emote = "emote"
}
export interface ItemRecord extends TimestampedRecord {
    category_id?: string;
    code: string;
    name: string;
    chance_min?: number;
    chance_max?: number;
    price?: number;
    image?: string;
    emote?: string;
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
