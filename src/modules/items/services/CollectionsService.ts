import { DB, TimestampedRecord } from '../../../common/DB';

export enum CollectionsFields
{
  code = 'code',
  name = 'name',
  fixed_bonus = 'fixed_bonus',
  context = 'context',
}

export enum CollectionsItemsFields
{
  collection_code = 'collection_code',
  item_code = 'item_code',
}

export enum UsersCollectionsFields
{
  user_id = 'user_id',
  context = 'context',
  collection_code = 'collection_code',
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export interface CollectionRecord extends TimestampedRecord
{
  [CollectionsFields.code]: string;
  [CollectionsFields.name]: string;
  [CollectionsFields.fixed_bonus]: number;
}

export interface CollectionItemRecord
{
  [CollectionsItemsFields.collection_code]: string;
  [CollectionsItemsFields.item_code]: string;
}

export interface UserCollectionRecord
{
  [UsersCollectionsFields.user_id]: string;
  [UsersCollectionsFields.context]: string;
  [UsersCollectionsFields.collection_code]: string;

  [CollectionsFields.name]?: string;
  [CollectionsFields.fixed_bonus]?: number;
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
export class CollectionsService
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
      `${CollectionsService.usersCollectionsTable}.${UsersCollectionsFields.context}`;

    const usersCollectionsCodeField =
      `${CollectionsService.usersCollectionsTable}.${UsersCollectionsFields.collection_code}`;

    const query = DB.usersCollections()
      .select(
        UsersCollectionsFields.user_id,
        UsersCollectionsFields.collection_code,
        usersCollectionsContextField,
        CollectionsFields.name,
        CollectionsFields.fixed_bonus,
      )
      .join(
        CollectionsService.collections,
        usersCollectionsCodeField,
        CollectionsFields.code,
      );

    if(userId)
      query.where(UsersCollectionsFields.user_id, userId);

    if(context)
      query.and.where(usersCollectionsContextField, context);

    if(collectionCodes)
      query.and.whereIn(usersCollectionsCodeField, collectionCodes);

    const data = await query;
    return data.map(CollectionsService.serializeUserCollection);
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
    const collectionCodeField = CollectionsItemsFields.collection_code;

    /* Get the completed collections that based on the item codes given. */
    const collectionItemsQuery = DB.collectionsItems()
      .select(collectionCodeField)
      .whereIn(CollectionsItemsFields.item_code, itemCodes)
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
          CollectionsService.collections,
          CollectionsItemsFields.collection_code,
          CollectionsFields.code,
        )
        .and.where(CollectionsFields.context, context);

    const completedCollections: CollectionItemRecord[] = await collectionItemsQuery;
    const completedCollectionCodes = completedCollections
      .map(collection => collection[CollectionsItemsFields.collection_code]);

    /* Get the completed collections of the user along with the collection data. */
    const usersCollectionsCodeField = UsersCollectionsFields.collection_code;
    const usersCollectionsCodeJoinField =
      `${CollectionsService.usersCollectionsTable}.${usersCollectionsCodeField}`;

    const userCollections: UserCollectionRecord[] = await DB.usersCollections()
      .select(usersCollectionsCodeField)
      .join(
        CollectionsService.collections,
        usersCollectionsCodeJoinField,
        CollectionsFields.code,
      )
      .where(UsersCollectionsFields.user_id, userId)
      .and.whereIn(
        usersCollectionsCodeJoinField,
        completedCollectionCodes,
      );

    const userCollectionCodes = userCollections.map(collection =>
      collection[UsersCollectionsFields.collection_code]);

    const newUserCollectionsInsertData = [];
    for(const code of completedCollectionCodes)
    {
      if(userCollectionCodes.includes(code)) continue;
      newUserCollectionsInsertData.push({
        [UsersCollectionsFields.user_id]: userId,
        [usersCollectionsCodeField]: code,
        [UsersCollectionsFields.context]: context,
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
      collection[UsersCollectionsFields.collection_code]
    );

    const collections = await DB.collections()
      .whereIn(CollectionsFields.code, collectionCodes);

    return collections.map(CollectionsService.serializeCollection);
  }

  static serializeCollection(collection: CollectionRecord): Collection
  {
    return {
      code: collection[CollectionsFields.code],
      name: collection[CollectionsFields.name],
      fixedBonus: collection[CollectionsFields.fixed_bonus],
    };
  }

  static serializeUserCollection(userCollectionRecord: UserCollectionRecord): UserCollection
  {
    const serialized: UserCollection =
    {
      userId: userCollectionRecord[UsersCollectionsFields.user_id],
      code: userCollectionRecord[UsersCollectionsFields.collection_code],
      context: userCollectionRecord[UsersCollectionsFields.context],
    };

    const collectionName = userCollectionRecord[CollectionsFields.name];
    if(collectionName)
      serialized.name = collectionName;

    const collectionFixedBonus = userCollectionRecord[CollectionsFields.fixed_bonus];
    if(collectionFixedBonus)
      serialized.fixedBonus = collectionFixedBonus;

    return serialized;
  }
}
