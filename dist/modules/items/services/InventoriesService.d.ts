export declare enum InventoriesFields {
    pk_id = "pk_id",
    user_id = "user_id",
    item_code = "item_code",
    user_id_item_code = "user_id_item_code",
    amount = "amount",
    context = "context",
    created_at = "created_at",
    updated_at = "updated_at",
    deleted_at = "deleted_at"
}
export declare const InventoriesService: {
    getUserItems(userId: string, context?: string | undefined): Promise<Inventory[]>;
    updateOrCreateUserItems({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            amount: number;
        }[];
        context?: string | undefined;
    }): Promise<any[]>;
    addUserItems({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            amount: number;
        }[];
        context?: string | undefined;
    }): Promise<any[]>;
    removeUserItem({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            amount: number;
        }[];
        context?: string | undefined;
    }): Promise<any[]>;
    updateUserItemAmounts({ userId, items, context, }: {
        userId: string;
        items: {
            code: string;
            addAmount?: number;
            subtractAmount?: number;
        }[];
        context?: string | undefined;
    }): Promise<any[]>;
    serialize(userItems: any[] | null): any[];
};
