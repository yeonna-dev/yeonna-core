export declare enum UsersBitsFields {
    user_id = "user_id",
    bit_id = "bit_id",
    tag_ids = "tag_ids"
}
export declare const UsersBitsService: {
    find({ userIDs, bitIDs, search, }: {
        userIDs?: string[] | undefined;
        bitIDs?: string[] | undefined;
        search?: string | undefined;
    }): Promise<any[]>;
    create(usersBitsData: {
        userID: string;
        bitID: string;
        tagIDs: string[];
    }[]): Promise<any[]>;
    remove({ userID, bitID }: {
        userID: string;
        bitID: string;
    }): Promise<{
        userID: any;
        bitID: any;
    }[]>;
    addTags({ userID, bitID, tagIDs }: {
        userID: string;
        bitID: string;
        tagIDs: string[];
    }): Promise<any[]>;
    serialize(usersBits: any[] | null): any[];
};
