import { DB, TimestampedRecord } from '../../../common/DB';
import { ItemsFields, ItemsService } from './ItemsService';

export enum InventoriesFields
{
  user_id = 'user_id',
  item_code = 'item_code',
  user_id_item_code = 'user_id_item_code',
  amount = 'amount',
  context = 'context',
};

export interface InventoryRecord extends TimestampedRecord
{
  [InventoriesFields.user_id]: string;
  [InventoriesFields.item_code]: string;
  [InventoriesFields.user_id_item_code]: string;
  [InventoriesFields.amount]: number;
  [InventoriesFields.context]?: string;

  /* Joined fields from `items` table */
  [ItemsFields.code]?: string;
  [ItemsFields.name]?: string;
  [ItemsFields.chance_min]?: number;
  [ItemsFields.chance_max]?: number;
  [ItemsFields.price]?: number;
  [ItemsFields.image]?: string;
  [ItemsFields.emote]?: string;
  [ItemsFields.category_id]?: string;
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
  categoryId?: string;
}

const createUserIdItemCodeKey = (userId: string, itemCode: string) => `${userId}:${itemCode}`;

export class InventoriesService
{
  static async getUserItems(userId: string, context?: string)
  {
    const query = DB.inventories()
      .join(ItemsService.table, InventoriesFields.item_code, ItemsFields.code)
      .where(InventoriesFields.user_id, userId);

    if(context)
      query.and.where(InventoriesFields.context, context);

    const data = await query;
    return data.map(InventoriesService.serialize);
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
      amount: number,
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
        [InventoriesFields.user_id]: userId,
        [InventoriesFields.item_code]: code,
        [InventoriesFields.user_id_item_code]: createUserIdItemCodeKey(userId, code),
        [InventoriesFields.amount]: amount,
        [InventoriesFields.context]: context,
      });
    }

    const data = await DB.inventories()
      .insert(upsertData)
      .returning('*')
      .onConflict(InventoriesFields.user_id_item_code)
      .merge([InventoriesFields.amount]);

    return data.map(InventoriesService.serialize);
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
      amount: number,
    }[],
    context?: string,
  })
  {
    const updatedItems = await InventoriesService.updateUserItemAmounts({
      userId,
      items: items.map(({ code, amount }) => ({ code, addAmount: amount })),
      context,
    });

    /* If the number of updated items is equal to the given items,
      it means that there are no new items to be added. */
    if(updatedItems.length === items.length)
      return updatedItems;

    return InventoriesService.updateOrCreateUserItems({
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
    return InventoriesService.updateUserItemAmounts({
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
    }[],
    context?: string,
  })
  {
    let whenClauses = [];
    const userIdItemCodeKeys = [];
    for(const { code, addAmount, subtractAmount } of items)
    {
      if(addAmount === 0 || subtractAmount === 0)
        continue;

      const userIdItemCode = createUserIdItemCodeKey(userId, code);
      userIdItemCodeKeys.push(userIdItemCode);

      if(subtractAmount)
        whenClauses.push(`
          WHEN (${InventoriesFields.user_id_item_code} = '${userIdItemCode}')
          AND (${InventoriesFields.amount} >= ${subtractAmount})
          THEN ${InventoriesFields.amount} - ${subtractAmount}
        `);
      else
        whenClauses.push(`
          WHEN ${InventoriesFields.user_id_item_code} = '${userIdItemCode}'
          THEN ${InventoriesFields.amount} + ${addAmount}
        `);
    }

    if(whenClauses.length === 0)
      return [];

    const updateQuery = `(CASE ${whenClauses.join(' ')} ELSE 0 END)`;
    const query = DB.inventories()
      .update({ [InventoriesFields.amount]: DB.knex.raw(updateQuery) })
      .whereIn(InventoriesFields.user_id_item_code, userIdItemCodeKeys)
      .returning('*');

    if(context)
      query.and.where({ [InventoriesFields.context]: context });

    const data = await query;
    return data.map(InventoriesService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(userItem: InventoryRecord): InventoryItem
  {
    const serialized: any =
    {
      amount: userItem[InventoriesFields.amount],
      context: userItem[InventoriesFields.context],
      code: userItem[InventoriesFields.item_code],
    };

    const itemFieldsMapping: any =
    {
      [ItemsFields.code]: 'code',
      [ItemsFields.name]: 'name',
      [ItemsFields.chance_min]: 'chanceMin',
      [ItemsFields.chance_max]: 'chanceMax',
      [ItemsFields.price]: 'price',
      [ItemsFields.image]: 'image',
      [ItemsFields.emote]: 'emote',
      [ItemsFields.category_id]: 'categoryId',
    };

    for(const field in itemFieldsMapping)
    {
      const serializedKey = itemFieldsMapping[field];
      const property = userItem[field as ItemsFields];
      if(property)
        serialized[serializedKey] = property;
    }

    return serialized;
  }
};
