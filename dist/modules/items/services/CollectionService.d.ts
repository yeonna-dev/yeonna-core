import { TimestampedRecord } from '../../../common/DB';
export declare enum CollectionField {
    code = "code",
    name = "name",
    fixed_bonus = "fixed_bonus",
    context = "context"
}
export declare enum CollectionItemField {
    collection_code = "collection_code",
    item_code = "item_code"
}
export declare enum UserCollectionField {
    user_id = "user_id",
    context = "context",
    collection_code = "collection_code"
}
export interface CollectionRecord extends TimestampedRecord {
    [CollectionField.code]: string;
    [CollectionField.name]: string;
    [CollectionField.fixed_bonus]: number;
}
export interface CollectionItemRecord {
    [CollectionItemField.collection_code]: string;
    [CollectionItemField.item_code]: string;
}
export interface UserCollectionRecord {
    [UserCollectionField.user_id]: string;
    [UserCollectionField.context]: string;
    [UserCollectionField.collection_code]: string;
    [CollectionField.name]?: string;
    [CollectionField.fixed_bonus]?: number;
}
export interface Collection {
    code: string;
    name: string;
    fixedBonus: number;
}
export interface CollectionItem {
    collectionCode: string;
    itemCode: string;
}
export interface UserCollection {
    userId: string;
    code: string;
    context: string;
    name?: string;
    fixedBonus?: number;
}
export declare class CollectionService {
    static collections: string;
    static collectionsItemsTable: string;
    static usersCollectionsTable: string;
    static getCollections({ userId, context, collectionCodes, }: {
        userId?: string;
        context?: string;
        collectionCodes?: string[];
    }): Promise<UserCollection[]>;
    static saveCompleted({ userId, itemCodes, context, }: {
        userId: string;
        itemCodes: string[];
        context?: string;
    }): Promise<Collection[]>;
    static serializeCollection(collection: CollectionRecord): Collection;
    static serializeUserCollection(userCollectionRecord: UserCollectionRecord): UserCollection;
}
//# sourceMappingURL=CollectionService.d.ts.map