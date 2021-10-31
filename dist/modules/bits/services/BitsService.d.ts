export declare enum BitsFields {
    id = "id",
    content = "content"
}
export declare const BitsService: {
    tableName: string;
    find({ ids, search, content, }: {
        ids?: string | string[] | undefined;
        search?: string | undefined;
        content?: string | undefined;
    }): Promise<BitRecord[]>;
    create(content: string | string[]): Promise<string[]>;
};
