export declare enum InventoriesFields {
    pk_id = "pk_id",
    user_id = "user_id",
    item_code = "item_code",
    amount = "amount",
    context = "context",
    created_at = "created_at",
    updated_at = "updated_at",
    deleted_at = "deleted_at"
}
export declare const InventoriesService: {
    getUserItems(userID: string, context?: string | undefined): Promise<Inventory[]>;
    updateOrCreateUserItem({ userID, itemCode, amount, context, add, remove, }: {
        userID: string;
        itemCode: string;
        amount?: number | undefined;
        context?: string | undefined;
        add?: boolean | undefined;
        remove?: boolean | undefined;
    }): Promise<void>;
    updateUserItems({ userID, items, context, }: {
        userID: string;
        items: {
            code: string;
            amount: number;
        }[];
        context?: string | undefined;
    }): Promise<{
        itemCode: string;
        amount: number;
        context: string | undefined;
    }[] | undefined>;
    serialize(items: InventoryRecord[]): {
        itemCode: string;
        amount: number;
        context: string | undefined;
    }[];
};
