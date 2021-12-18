export declare enum ItemsFields {
    category_id = "category_id",
    code = "code",
    name = "name",
    chance_min = "chance_min",
    chance_max = "chance_max",
    price = "price",
    image = "image",
    emote = "emote",
    created_at = "created_at",
    updated_at = "updated_at",
    deleted_at = "deleted_at"
}
export declare const ItemsService: {
    find({ code, chance, }: {
        code?: string | undefined;
        chance?: number | undefined;
    }): Promise<{
        categoryID: string | undefined;
        code: string;
        name: string;
        chanceMin: number | undefined;
        chanceMax: number | undefined;
        price: number | undefined;
        image: string | undefined;
        emote: string | undefined;
    }[]>;
    findRandom({ code, chance, }: {
        code?: string | undefined;
        chance?: number | undefined;
    }): Promise<{
        categoryID: string | undefined;
        code: string;
        name: string;
        chanceMin: number | undefined;
        chanceMax: number | undefined;
        price: number | undefined;
        image: string | undefined;
        emote: string | undefined;
    } | undefined>;
    findByCodes(codes: string[]): Promise<{
        categoryID: string | undefined;
        code: string;
        name: string;
        chanceMin: number | undefined;
        chanceMax: number | undefined;
        price: number | undefined;
        image: string | undefined;
        emote: string | undefined;
    }[]>;
    serialize(items: ItemRecord[]): {
        categoryID: string | undefined;
        code: string;
        name: string;
        chanceMin: number | undefined;
        chanceMax: number | undefined;
        price: number | undefined;
        image: string | undefined;
        emote: string | undefined;
    }[];
};
