import { DB, TimestampedRecord } from '../../../common/DB';
import { ItemField, ItemService } from './ItemService';

export enum InventoryField
{
  user_id = 'user_id',
  item_code = 'item_code',
  user_id_item_code = 'user_id_item_code',
  amount = 'amount',
  context = 'context',
};

const categoriesTable = 'categories';
const categoryIdField = 'id';
const categoryNameField = 'name';
const categoryNameAlias = 'category_name';

export interface InventoryRecord extends TimestampedRecord
{
  [InventoryField.user_id]: string;
  [InventoryField.item_code]: string;
  [InventoryField.user_id_item_code]: string;
  [InventoryField.amount]: number;
  [InventoryField.context]?: string;

  /* Joined fields from `items` table */
  [ItemField.code]?: string;
  [ItemField.name]?: string;
  [ItemField.chance_min]?: number;
  [ItemField.chance_max]?: number;
  [ItemField.price]?: number;
  [ItemField.image]?: string;
  [ItemField.emote]?: string;
  [ItemField.category_id]?: string;

  /* Joined fields from 'categories' table */
  [categoryNameAlias]?: string;
}

export interface InventoryItem
{
  amount: number;
  context?: string;
  code: string;
  name?: string;
  chanceMin?: number;
  chanceMax?: number;
  price?: number;
  image?: string;
  emote?: string;
  category?: string;
}

const createUserIdItemCodeKey = (userId: string, itemCode: string) => `${userId}:${itemCode}`;

export class InventoryService
{
  static table = 'inventories';

  static async getUserItems({
    userId,
    context,
    category,
  }: {
    userId: string,
    context?: string,
    category?: string,
  })
  {
    const query = DB.inventories()
      .select(
        `${InventoryService.table}.*`,
        `${ItemService.table}.*`,
        `${categoriesTable}.${categoryNameField} as ${categoryNameAlias}`,
      )
      .join(ItemService.table, InventoryField.item_code, ItemField.code)
      .join(categoriesTable, ItemField.category_id, `${categoriesTable}.${categoryIdField}`)
      .where(InventoryField.user_id, userId);

    if(context)
      query.and.where(`${InventoryService.table}.${InventoryField.context}`, context);

    if(category)
      query.and.whereILike(`${categoriesTable}.${categoryNameField}`, category.toLowerCase());

    const data = await query;
    return data.map(InventoryService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async updateOrCreateUserItems({
    userId,
    items,
    context,
  }: {
    userId: string,
    items:
    {
      code: string,
      amount?: number,
    }[],
    context?: string,
  })
  {
    const upsertData: InventoryRecord[] = [];
    for(const { code, amount } of items)
    {
      if(amount === 0)
        continue;

      upsertData.push({
        [InventoryField.user_id]: userId,
        [InventoryField.item_code]: code,
        [InventoryField.user_id_item_code]: createUserIdItemCodeKey(userId, code),
        [InventoryField.amount]: amount || 1,
        [InventoryField.context]: context,
      });
    }

    const data = await DB.inventories()
      .insert(upsertData)
      .returning('*')
      .onConflict(InventoryField.user_id_item_code)
      .merge([InventoryField.amount]);

    return data.map(InventoryService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async addUserItems({
    userId,
    items,
    context,
  }: {
    userId: string,
    items:
    {
      code: string,
      amount?: number,
    }[],
    context?: string,
  })
  {
    const updatedItems = await InventoryService.updateUserItemAmounts({
      userId,
      items: items.map(({ code, amount }) => ({ code, addAmount: amount || 1 })),
      context,
    });

    /* If the number of updated items is equal to the given items,
      it means that there are no new items to be added. */
    if(updatedItems.length === items.length)
      return updatedItems;

    return InventoryService.updateOrCreateUserItems({
      userId,
      items,
      context,
    });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async removeUserItem({
    userId,
    items,
    context,
  }: {
    userId: string,
    items:
    {
      code: string,
      amount: number,
    }[],
    context?: string,
  })
  {
    return InventoryService.updateUserItemAmounts({
      userId,
      items: items.map(({ code, amount }) => ({ code, subtractAmount: amount })),
      context,
    });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async updateUserItemAmounts({
    userId,
    items,
    context,
  }: {
    userId: string,
    items:
    {
      code: string,
      addAmount?: number,
      subtractAmount?: number,
      amount?: number,
    }[],
    context?: string,
  })
  {
    let whenClauses = [];
    const userIdItemCodeKeys = [];
    for(const { code, amount, addAmount, subtractAmount } of items)
    {
      if(addAmount === 0 || subtractAmount === 0)
        continue;

      const userIdItemCode = createUserIdItemCodeKey(userId, code);
      userIdItemCodeKeys.push(userIdItemCode);

      const whenUserIdItemCodeClause =
        `WHEN (${InventoryField.user_id_item_code} = '${userIdItemCode}')`;

      if(addAmount)
        whenClauses.push(`
          ${whenUserIdItemCodeClause}
          THEN ${InventoryField.amount} + ${addAmount}
        `);
      else if(subtractAmount)
        whenClauses.push(`
          ${whenUserIdItemCodeClause}
          AND (${InventoryField.amount} >= ${subtractAmount})
          THEN ${InventoryField.amount} - ${subtractAmount}
        `);
      else
        whenClauses.push(`${whenUserIdItemCodeClause} THEN ${amount}`);
    }

    if(whenClauses.length === 0)
      return [];

    const updateQuery = `(CASE ${whenClauses.join(' ')} ELSE 0 END)`;
    const query = DB.inventories()
      .update({ [InventoryField.amount]: DB.knex.raw(updateQuery) })
      .whereIn(InventoryField.user_id_item_code, userIdItemCodeKeys)
      .returning('*');

    if(context)
      query.and.where({ [InventoryField.context]: context });

    const data = await query;
    const updatedItemsIndices = data.map(record => record[InventoryField.user_id_item_code]);

    await DB.inventories()
      .delete()
      .where({ [InventoryField.amount]: 0 })
      .and.whereIn(InventoryField.user_id_item_code, updatedItemsIndices);

    return data.map(InventoryService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(userItem: InventoryRecord): InventoryItem
  {
    const serialized: any =
    {
      amount: userItem[InventoryField.amount],
      context: userItem[InventoryField.context],
      code: userItem[InventoryField.item_code],
    };

    const itemFieldsMapping: any =
    {
      [ItemField.code]: 'code',
      [ItemField.name]: 'name',
      [ItemField.chance_min]: 'chanceMin',
      [ItemField.chance_max]: 'chanceMax',
      [ItemField.price]: 'price',
      [ItemField.image]: 'image',
      [ItemField.emote]: 'emote',
      [categoryNameAlias]: 'category'
    };

    for(const field in itemFieldsMapping)
    {
      const serializedKey = itemFieldsMapping[field];
      const property = userItem[field as ItemField];
      if(property)
        serialized[serializedKey] = property;
    }

    return serialized;
  }
};
