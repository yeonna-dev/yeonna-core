export declare enum BitsFields {
    id = "id",
    content = "content"
}
export declare const BitsService: {
    table: string;
    find({ ids, search, content, }: {
        ids?: string | string[] | undefined;
        search?: string | undefined;
        content?: string | undefined;
    }): Promise<any[]>;
    create(content: string | string[]): Promise<any[]>;
};
