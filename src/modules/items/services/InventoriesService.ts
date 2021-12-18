import { DB } from '../../../common/DB';
import { ItemsFields, ItemsService } from './ItemsService';

export enum InventoriesFields
{
  pk_id = 'pk_id',
  user_id = 'user_id',
  item_code = 'item_code',
  user_id_item_code = 'user_id_item_code',
  amount = 'amount',
  context = 'context',
  created_at = 'created_at',
  updated_at = 'updated_at',
  deleted_at = 'deleted_at',
};

const createUserIdItemCodeKey = (userId: string, itemCode: string) => `${userId}:${itemCode}`;

export const InventoriesService = new class
{
  async getUserItems(userId: string, context?: string): Promise<Inventory[]>
  {
    const query = DB.inventories()
      .join(ItemsService.table, InventoriesFields.item_code, ItemsFields.code)
      .where(InventoriesFields.user_id, userId);

    if(context)
      query.and.where(InventoriesFields.context, context);

    const data = await query;
    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updateOrCreateUserItems({
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
    const upsertData: any[] = [];
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

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async addUserItems({
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
    const updatedItems = await this.updateUserItemAmounts({
      userId,
      items: items.map(({ code, amount }) => ({ code, addAmount: amount })),
      context,
    });

    /* If the number of updated items is equal to the given items,
      it means that there are no new items to be added. */
    if(updatedItems.length === items.length)
      return updatedItems;

    return this.updateOrCreateUserItems({
      userId,
      items,
      context,
    });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async removeUserItem({
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
    return this.updateUserItemAmounts({
      userId,
      items: items.map(({ code, amount }) => ({ code, subtractAmount: amount })),
      context,
    });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updateUserItemAmounts({
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
    const data = await DB.inventories()
      .update({ [InventoriesFields.amount]: DB.knex.raw(updateQuery) })
      .whereIn(InventoriesFields.user_id_item_code, userIdItemCodeKeys)
      .returning('*');

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  serialize(userItems: any[] | null)
  {
    const itemFieldsMapping: any = {
      [ItemsFields.code]: 'code',
      [ItemsFields.name]: 'name',
      [ItemsFields.chance_min]: 'chanceMin',
      [ItemsFields.chance_max]: 'chanceMax',
      [ItemsFields.price]: 'price',
      [ItemsFields.image]: 'image',
      [ItemsFields.emote]: 'emote',
      [ItemsFields.category_id]: 'categoryID',
    };

    const data = [];
    for(const userItem of userItems || [])
    {
      const serialized: any =
      {
        amount: userItem[InventoriesFields.amount],
        context: userItem[InventoriesFields.context],
      };

      for(const field in itemFieldsMapping)
      {
        const serializedKey = itemFieldsMapping[field];
        const property = userItem[field];
        if(property)
          serialized[serializedKey] = property;
      }

      data.push(serialized);
    };

    return data;
  }
};
