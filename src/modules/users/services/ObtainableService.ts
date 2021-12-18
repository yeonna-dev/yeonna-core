import { DB } from '../../../common/DB';

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
  async find({
    userID,
    isCollectible,
    context,
  }: {
    userID: string,
    isCollectible?: boolean,
    context?: string,
  })
  {
    const query = DB.obtainables()
      .where(ObtainableFields.user_id, userID)
      .and.where(ObtainableFields.is_collectible, Boolean(isCollectible));

    if(context)
      query.and.where(ObtainableFields.context, context);

    const data = await query;
    const amount = data?.pop()?.amount;
    if(amount) return Number(amount);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /* Creates an obtainable record */
  async create({
    userID,
    amount = 0,
    isCollectible,
    context,
  }: {
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

    const data = await DB.obtainables().insert(insertData).returning('*');
    const obtainableRecord = data?.pop();
    if(!obtainableRecord)
      throw new Error('Obtainable record not created');

    return true;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async update({
    userID,
    amount,
    isCollectible,
    context,
  }: {
    userID: string,
    amount: number,
    isCollectible?: boolean,
    context?: string,
  })
  {
    const query = DB.obtainables()
      .update({ [ObtainableFields.amount]: amount })
      .returning('*')
      .where(ObtainableFields.user_id, userID)
      .and.where(ObtainableFields.is_collectible, Boolean(isCollectible));

    if(context)
      query.and.where(ObtainableFields.context, context);

    const data = await query;
    const resultAmount = data?.pop()?.amount;
    if(resultAmount) return Number(resultAmount);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async getTop({
    count,
    isCollectible,
    context,
  }: {
    count: number,
    isCollectible?: boolean,
    context?: string,
  })
  {
    const query = DB.obtainables()
      .orderBy(ObtainableFields.amount, 'desc')
      .where(ObtainableFields.is_collectible, Boolean(isCollectible))
      .limit(count);

    if(context)
      query.and.where(ObtainableFields.context, context);

    return query;
  }
};
