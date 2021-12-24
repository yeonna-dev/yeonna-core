import { DB, TimestampedRecord } from '../../../common/DB';

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

export interface ObtainableRecord extends TimestampedRecord
{
  user_id: string;
  amount: number;
  context?: string;
  is_collectible?: boolean;
}

export interface Obtainable
{
  userId: string;
  amount: number;
  context?: string;
  isCollectible?: boolean;
}

export class ObtainableService
{
  static async find({
    userId,
    isCollectible,
    context,
  }: {
    userId: string,
    isCollectible?: boolean,
    context?: string,
  })
  {
    const query = DB.obtainables()
      .where(ObtainableFields.user_id, userId)
      .and.where(ObtainableFields.is_collectible, Boolean(isCollectible));

    if(context)
      query.and.where(ObtainableFields.context, context);

    const data = await query;
    const amount = data?.pop()?.amount;
    if(amount) return Number(amount);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /* Creates an obtainable record */
  static async create({
    userId,
    amount = 0,
    isCollectible,
    context,
  }: {
    userId: string,
    amount: number,
    isCollectible?: boolean,
    context?: string,
  }): Promise<Boolean>
  {
    const insertData: ObtainableRecord =
    {
      [ObtainableFields.user_id]: userId,
      [ObtainableFields.amount]: amount,
      [ObtainableFields.is_collectible]: isCollectible,
    };

    if(context)
      insertData[ObtainableFields.context] = context;

    const data = await DB.obtainables().insert(insertData).returning('*');
    const obtainableRecord = data?.pop();
    if(!obtainableRecord)
      throw new Error('Obtainable record not created');

    return true;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async update({
    userId,
    amount,
    isCollectible,
    context,
  }: {
    userId: string,
    amount: number,
    isCollectible?: boolean,
    context?: string,
  })
  {
    const query = DB.obtainables()
      .update({ [ObtainableFields.amount]: amount })
      .returning('*')
      .where(ObtainableFields.user_id, userId)
      .and.where(ObtainableFields.is_collectible, Boolean(isCollectible));

    if(context)
      query.and.where(ObtainableFields.context, context);

    const data = await query;
    const resultAmount = data?.pop()?.amount;
    if(resultAmount) return Number(resultAmount);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async getTop({
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

    const data = await query;
    return data.map(ObtainableService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(obtainableRecord: ObtainableRecord): Obtainable
  {
    return {
      userId: obtainableRecord[ObtainableFields.user_id],
      amount: obtainableRecord[ObtainableFields.amount],
      context: obtainableRecord[ObtainableFields.context],
      isCollectible: obtainableRecord[ObtainableFields.is_collectible],
    };
  }
};
