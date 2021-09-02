import { supabase } from '../../../common/supabase-client';

const obtainables = () => supabase.from<ObtainableRecord>('obtainables');
export enum ObtainableFields
{
  user_id = 'user_id',
  amount = 'amount',
  is_collectible = 'is_collectible',
  context = 'context',
  created_at = 'created_at',
  updated_at = 'updated_at',
  deleted_at = 'deleted_at',
}

export const ObtainableService = new class
{
  /* Creates an obtainable record */
  async createObtainable({
    userID,
    amount = 0,
    isCollectible,
    context,
  } : {
    userID: string,
    amount: number,
    isCollectible?: boolean,
    context?: string,
  }): Promise<Boolean>
  {
    const insertData: ObtainableRecord =
    {
      user_id: userID,
      amount,
      is_collectible: isCollectible,
    };

    if(context)
      insertData.context = context;

    const { data, error } = await obtainables().insert(insertData);
    if(error)
      throw error;

    const obtainableRecord = data?.pop();
    if(! obtainableRecord)
      throw new Error('Obtainable record not created');

    return true;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async getObtainable({
    userID,
    isCollectible,
    context,
  } : {
    userID: string,
    isCollectible?: boolean,
    context?: string,
  })
  {
    const query = obtainables()
      .select()
      .eq(ObtainableFields.user_id, userID)
      .is(ObtainableFields.is_collectible, isCollectible ? true : false);

    if(context)
      query.eq(ObtainableFields.context, context);

    const { data, error } = await query;
    if(error)
      throw error;

    return data?.pop()?.amount;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updateObtainables({
    userID,
    amount,
    isCollectible,
    context,
  } : {
    userID: string,
    amount: number,
    isCollectible?: boolean,
    context?: string,
  })
  {
    const query = obtainables()
      .update({ [ObtainableFields.amount]: amount })
      .match({ [ObtainableFields.user_id]: userID })
      .is(ObtainableFields.is_collectible, isCollectible ? true : false);

    if(context)
      query.eq(ObtainableFields.context, context);

    const { data, error } = await query;
    if(error)
      throw error;

    return data?.pop()?.amount;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async getTop({
    count,
    isCollectible,
    context,
  } : {
    count: number,
    isCollectible?: boolean,
    context?: string,
  })
  {
    const query = obtainables()
      .select()
      .order(ObtainableFields.amount, { ascending: false })
      .is(ObtainableFields.is_collectible, isCollectible ? true : false)
      .limit(count);

    if(context)
      query.eq(ObtainableFields.context, context);

    const { data, error } = await query;
    if(error)
      throw error;

    return data;
  }
}
