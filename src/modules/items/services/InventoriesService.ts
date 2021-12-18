import { DB } from '../../../common/DB';

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
      .where(InventoriesFields.user_id, userId);

    if(context)
      query.andWhere(InventoriesFields.context, context);

    const data = await query;
    return data && data.length !== 0 ? this.serialize(data) : [];
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

    return data && data.length !== 0 ? this.serialize(data) : [];
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

    if(updatedItems.length !== 0)
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
    return DB.inventories()
      .update({ [InventoriesFields.amount]: DB.knex.raw(updateQuery) })
      .whereIn(InventoriesFields.user_id_item_code, userIdItemCodeKeys)
      .returning('*');
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  serialize(items: InventoryRecord[])
  {
    return items.map(item =>
    ({
      itemCode: item[InventoriesFields.item_code],
      amount: item[InventoriesFields.amount],
      context: item[InventoriesFields.context],
    }));
  }
};
