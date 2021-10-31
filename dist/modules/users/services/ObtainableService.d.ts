export declare enum ObtainableFields {
    user_id = "user_id",
    amount = "amount",
    is_collectible = "is_collectible",
    context = "context",
    created_at = "created_at",
    updated_at = "updated_at",
    deleted_at = "deleted_at"
}
export declare const ObtainableService: {
    createObtainable({ userID, amount, isCollectible, context, }: {
        userID: string;
        amount: number;
        isCollectible?: boolean | undefined;
        context?: string | undefined;
    }): Promise<Boolean>;
    getObtainable({ userID, isCollectible, context, }: {
        userID: string;
        isCollectible?: boolean | undefined;
        context?: string | undefined;
    }): Promise<number | undefined>;
    updateObtainables({ userID, amount, isCollectible, context, }: {
        userID: string;
        amount: number;
        isCollectible?: boolean | undefined;
        context?: string | undefined;
    }): Promise<number | undefined>;
    getTop({ count, isCollectible, context, }: {
        count: number;
        isCollectible?: boolean | undefined;
        context?: string | undefined;
    }): Promise<ObtainableRecord[] | null>;
};
