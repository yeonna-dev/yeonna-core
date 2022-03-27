import { TimestampedRecord } from '../../../common/DB';
export declare enum CollectionsFields {
    code = "code",
    name = "name",
    fixed_bonus = "fixed_bonus",
    context = "context"
}
export declare enum CollectionsItemsFields {
    collection_code = "collection_code",
    item_code = "item_code"
}
export declare enum UsersCollectionsFields {
    user_id = "user_id",
    context = "context",
    collection_code = "collection_code"
}
export interface CollectionRecord extends TimestampedRecord {
    [CollectionsFields.code]: string;
    [CollectionsFields.name]: string;
    [CollectionsFields.fixed_bonus]: number;
}
export interface CollectionItemRecord {
    [CollectionsItemsFields.collection_code]: string;
    [CollectionsItemsFields.item_code]: string;
}
export interface UserCollectionRecord {
    [UsersCollectionsFields.user_id]: string;
    [UsersCollectionsFields.context]: string;
    [UsersCollectionsFields.collection_code]: string;
    [CollectionsFields.name]?: string;
    [CollectionsFields.fixed_bonus]?: number;
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
export declare class CollectionsService {
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
//# sourceMappingURL=CollectionsService.d.ts.map