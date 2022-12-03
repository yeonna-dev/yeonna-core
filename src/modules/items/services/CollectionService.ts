import { DB, TimestampedRecord } from '../../../common/DB';

export enum CollectionField
{
  code = 'code',
  name = 'name',
  fixed_bonus = 'fixed_bonus',
  context = 'context',
}

export enum CollectionItemField
{
  collection_code = 'collection_code',
  item_code = 'item_code',
}

export enum UserCollectionField
{
  user_id = 'user_id',
  context = 'context',
  collection_code = 'collection_code',
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export interface CollectionRecord extends TimestampedRecord
{
  [CollectionField.code]: string;
  [CollectionField.name]: string;
  [CollectionField.fixed_bonus]: number;
}

export interface CollectionItemRecord
{
  [CollectionItemField.collection_code]: string;
  [CollectionItemField.item_code]: string;
}

export interface UserCollectionRecord
{
  [UserCollectionField.user_id]: string;
  [UserCollectionField.context]: string;
  [UserCollectionField.collection_code]: string;

  [CollectionField.name]?: string;
  [CollectionField.fixed_bonus]?: number;
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export interface Collection
{
  code: string;
  name: string;
  fixedBonus: number;
}

export interface CollectionItem
{
  collectionCode: string;
  itemCode: string;
}

export interface UserCollection
{
  userId: string;
  code: string;
  context: string;
  name?: string;
  fixedBonus?: number;
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* This class includes operations that involve the `collections`,
  `collections_items`, and `users_collections` tables. */
export class CollectionService
{
  static collections = 'collections';
  static collectionsItemsTable = 'collections_items';
  static usersCollectionsTable = 'users_collections';

  static async getCollections({
    userId,
    context,
    collectionCodes,
  }: {
    userId?: string,
    context?: string,
    collectionCodes?: string[],
  })
  {
    const usersCollectionsContextField =
      `${CollectionService.usersCollectionsTable}.${UserCollectionField.context}`;

    const usersCollectionsCodeField =
      `${CollectionService.usersCollectionsTable}.${UserCollectionField.collection_code}`;

    const query = DB.usersCollections()
      .select(
        UserCollectionField.user_id,
        UserCollectionField.collection_code,
        usersCollectionsContextField,
        CollectionField.name,
        CollectionField.fixed_bonus,
      )
      .join(
        CollectionService.collections,
        usersCollectionsCodeField,
        CollectionField.code,
      );

    if(userId)
      query.where(UserCollectionField.user_id, userId);

    if(context)
      query.and.where(usersCollectionsContextField, context);

    if(collectionCodes)
      query.and.whereIn(usersCollectionsCodeField, collectionCodes);

    const data = await query;
    return data.map(CollectionService.serializeUserCollection);
  }

  static async saveCompleted({
    userId,
    itemCodes,
    context,
  }: {
    userId: string,
    itemCodes: string[],
    context?: string,
  })
  {
    const collectionCodeField = CollectionItemField.collection_code;

    /* Get the completed collections that based on the item codes given. */
    const collectionItemsQuery = DB.collectionsItems()
      .select(collectionCodeField)
      .whereIn(CollectionItemField.item_code, itemCodes)
      .groupBy(collectionCodeField)
      .having(DB.knex.raw(`
        (${collectionCodeField}, count(${collectionCodeField}))
        in (${DB.collectionsItems()
          .select(collectionCodeField, DB.knex.raw(`count(${collectionCodeField})`))
          .groupBy(collectionCodeField)
        })
      `));

    if(context)
      collectionItemsQuery
        .join(
          CollectionService.collections,
          CollectionItemField.collection_code,
          CollectionField.code,
        )
        .and.where(CollectionField.context, context);

    const completedCollections: CollectionItemRecord[] = await collectionItemsQuery;
    const completedCollectionCodes = completedCollections
      .map(collection => collection[CollectionItemField.collection_code]);

    /* Get the completed collections of the user along with the collection data. */
    const usersCollectionsCodeField = UserCollectionField.collection_code;
    const usersCollectionsCodeJoinField =
      `${CollectionService.usersCollectionsTable}.${usersCollectionsCodeField}`;

    const userCollections: UserCollectionRecord[] = await DB.usersCollections()
      .select(usersCollectionsCodeField)
      .join(
        CollectionService.collections,
        usersCollectionsCodeJoinField,
        CollectionField.code,
      )
      .where(UserCollectionField.user_id, userId)
      .and.whereIn(
        usersCollectionsCodeJoinField,
        completedCollectionCodes,
      );

    const userCollectionCodes = userCollections.map(collection =>
      collection[UserCollectionField.collection_code]);

    const newUserCollectionsInsertData = [];
    for(const code of completedCollectionCodes)
    {
      if(userCollectionCodes.includes(code)) continue;
      newUserCollectionsInsertData.push({
        [UserCollectionField.user_id]: userId,
        [usersCollectionsCodeField]: code,
        [UserCollectionField.context]: context,
      });
    }

    if(newUserCollectionsInsertData.length === 0)
      return [];

    /* Save the new collections for the user with the given user ID. */
    const newUserCollections = await DB.usersCollections()
      .insert(newUserCollectionsInsertData)
      .returning(usersCollectionsCodeField);

    /* Get the collections data of the new completed collections. */
    const collectionCodes = newUserCollections.map(collection =>
      collection[UserCollectionField.collection_code]
    );

    const collections = await DB.collections()
      .whereIn(CollectionField.code, collectionCodes);

    return collections.map(CollectionService.serializeCollection);
  }

  static serializeCollection(collection: CollectionRecord): Collection
  {
    return {
      code: collection[CollectionField.code],
      name: collection[CollectionField.name],
      fixedBonus: collection[CollectionField.fixed_bonus],
    };
  }

  static serializeUserCollection(userCollectionRecord: UserCollectionRecord): UserCollection
  {
    const serialized: UserCollection =
    {
      userId: userCollectionRecord[UserCollectionField.user_id],
      code: userCollectionRecord[UserCollectionField.collection_code],
      context: userCollectionRecord[UserCollectionField.context],
    };

    const collectionName = userCollectionRecord[CollectionField.name];
    if(collectionName)
      serialized.name = collectionName;

    const collectionFixedBonus = userCollectionRecord[CollectionField.fixed_bonus];
    if(collectionFixedBonus)
      serialized.fixedBonus = collectionFixedBonus;

    return serialized;
  }
}
