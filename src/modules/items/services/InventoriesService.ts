import { supabase } from '../../../common/supabase-client';

const inventories = () => supabase.from<InventoryRecord>('inventories');
export enum InventoriesFields
{
  pk_id = 'pk_id',
  user_id = 'user_id',
  item_code = 'item_code',
  amount = 'amount',
  context = 'context',
  created_at = 'created_at',
  updated_at = 'updated_at',
  deleted_at = 'deleted_at',
};

export const InventoriesService = new class
{
  async getUserItems(userID: string, context?: string): Promise<Inventory[]>
  {
    const query = inventories()
      .select()
      .eq(InventoriesFields.user_id, userID);

    if(context)
      query.eq(InventoriesFields.context, context);

    const { data, error } = await query;
    if(error)
      throw error;

    // TODO: Flip condition
    return ! data || data.length === 0 ? [] : this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  // TODO: Use upsert
  async updateOrCreateUserItem({
    userID,
    itemCode,
    amount = 1,
    context,
    add,
    remove,
  } : {
    userID: string,
    itemCode: string,
    amount?: number,
    context?: string,
    add?: boolean,
    remove?: boolean,
  })
  {
    const match: Record<string, unknown> =
    {
      [InventoriesFields.item_code]: itemCode,
      [InventoriesFields.user_id]: userID,
    };

    /* Get the user's current item. */
    const { data: itemRecords, error: getError } = await inventories()
      .select()
      .match(match);

    if(getError)
      throw getError;

    /* If the user doesn't have the item, create the inventory record. */
    const [ item ] = itemRecords || [];
    if(! item && ! remove)
    {
      const { error } = await inventories()
        .insert({
          [InventoriesFields.item_code]: itemCode,
          [InventoriesFields.user_id]: userID,
          [InventoriesFields.amount]: amount,
          [InventoriesFields.context]: context,
        });

      if(error)
        throw error;

      return;
    }

    /* Update the user's item amount. */
    const previousAmount = item[InventoriesFields.amount];
    let newAmount = amount;
    if(add)
      newAmount += previousAmount;
    if(remove)
      newAmount = previousAmount === 0 ? 0 : previousAmount - 1;

    const { error } = await inventories()
      .update({ [InventoriesFields.amount]: newAmount })
      .match(match);

    if(error)
      throw error;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updateUserItems({
    userID,
    items,
    context,
  } : {
    userID: string,
    items:
    {
      code: string,
      amount: number,
    }[],
    context?: string,
  })
  {
    const amountsMap: any = {};
    for(const { code, amount } of items)
      amountsMap[code] = amount;

    const { data: userItems, error: getError } = await inventories()
      .select()
      .eq(InventoriesFields.user_id, userID)
      .in(InventoriesFields.item_code, items.map(({ code }) => code))

    if(getError)
      throw getError;

    if(! userItems)
      return;

    const upsertDataMap: any = {};
    for(const item of userItems)
    {
      const code = item[InventoriesFields.item_code];
      upsertDataMap[code] =
      {
        [InventoriesFields.pk_id]: item[InventoriesFields.pk_id],
        [InventoriesFields.user_id]: userID,
        [InventoriesFields.item_code]: code,
        [InventoriesFields.amount]: amountsMap[code],
        [InventoriesFields.context]: context,
      };
    }

    for(const code in amountsMap)
    {
      if(upsertDataMap[code])
        continue;

      upsertDataMap[code] =
      {
        // TODO: Add unique column for upsert
        [InventoriesFields.pk_id]: 9999,
        [InventoriesFields.user_id]: userID,
        [InventoriesFields.item_code]: code,
        [InventoriesFields.amount]: amountsMap[code],
        [InventoriesFields.context]: context,
      };
    }

    const { data, error } = await inventories()
      .upsert(Object.values(upsertDataMap));

    if(error)
      throw error;

    // TODO: Flip condition
    return ! data || data.length === 0 ? [] : this.serialize(data);
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
}
