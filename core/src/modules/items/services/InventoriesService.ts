import { supabase } from '../../../common/supabase-client';

const inventories = () => supabase.from<InventoryRecord>('inventories');
export enum InventoriesFields
{
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
  async getUserItems(userID: string, context?: string): Promise<InventoryItem[]>
  {
    const query = inventories()
      .select()
      .eq(InventoriesFields.user_id, userID);

    if(context)
      query.eq(InventoriesFields.context, context);

    const { data, error } = await query;
    if(error)
      throw error;

    if(! data)
      return [];

    return data.map(item => ({
      itemCode: item[InventoriesFields.item_code],
      amount: item[InventoriesFields.amount],
      context: item[InventoriesFields.context],
    }));
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updateUserItem({
    itemCode,
    userID,
    amount = 1,
    context,
    add,
    remove,
  } : {
    itemCode: string,
    userID: string,
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
}
