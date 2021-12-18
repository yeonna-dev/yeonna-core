export declare enum TagsFields {
    id = "id",
    name = "name"
}
export declare const TagsService: {
    tableName: string;
    find({ ids, search, names, }: {
        ids?: string | string[] | undefined;
        search?: string | undefined;
        names?: string[] | undefined;
    }): Promise<{
        id: string;
        name: string;
    }[]>;
    create(names: string | string[]): Promise<{
        id: string;
        name: string;
    }[]>;
    remove(names: string | string[]): Promise<{
        id: string;
        name: string;
    }[]>;
    serialize(tags: TagRecord[] | null): {
        id: string;
        name: string;
    }[];
};
