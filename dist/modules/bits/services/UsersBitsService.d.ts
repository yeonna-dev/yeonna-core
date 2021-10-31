export declare enum UsersBitsFields {
    user_id = "user_id",
    bit_id = "bit_id",
    bit = "bit"
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
    }[]): Promise<any[]>;
    remove({ userID, bitID }: {
        userID: string;
        bitID: string;
    }): Promise<any[]>;
    serialize(usersBits: UserBitRecord[] | null): any[];
};
