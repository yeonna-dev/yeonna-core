import { DB, TimestampedRecord } from '../../../common/DB';
import { UsersFields, UsersService } from './UsersService';

export enum ObtainableFields
{
  user_id = 'user_id',
  amount = 'amount',
  is_collectible = 'is_collectible',
  context = 'context',
}

export interface ObtainableRecord extends TimestampedRecord
{
  [ObtainableFields.user_id]: string;
  [ObtainableFields.amount]: number;
  [ObtainableFields.is_collectible]?: boolean;
  [ObtainableFields.context]?: string;

  /* Joined fields from `users` table */
  [UsersFields.discord_id]?: string;
  [UsersFields.twitch_id]?: string;
}

export interface Obtainable
{
  user:
  {
    id: string;
    discordId?: string;
    twitchId?: string;
  };
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

  /* Creates an obtainable record.
    Returns a boolean that determines if the record was created or not. */
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
    /* Try to find the obtainable record with the given `userId`, `is_collectible`
      and `context` fields first before inserting to ensure of no duplicates. */
    const existingQuery = DB.obtainables()
      .where(ObtainableFields.user_id, userId);

    if(isCollectible)
      existingQuery.and.where(ObtainableFields.is_collectible, isCollectible);

    if(context)
      existingQuery.and.where(ObtainableFields.context, context);

    const existing = await existingQuery;
    if(existing.length > 0)
      return false;

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
    withUsers,
  }: {
    count: number,
    isCollectible?: boolean,
    context?: string,
    withUsers?: boolean,
  })
  {
    const query = DB.obtainables()
      .orderBy(ObtainableFields.amount, 'desc')
      .where(ObtainableFields.is_collectible, Boolean(isCollectible))
      .and.where(ObtainableFields.amount, '>', 0)
      .limit(count);

    if(context)
      query.and.where(ObtainableFields.context, context);

    if(withUsers)
      query.join(UsersService.table, ObtainableFields.user_id, UsersFields.id);

    const data = await query;
    return data.map(ObtainableService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(obtainableRecord: ObtainableRecord): Obtainable
  {
    return {
      user:
      {
        id: obtainableRecord[ObtainableFields.user_id],
        discordId: obtainableRecord[UsersFields.discord_id],
        twitchId: obtainableRecord[UsersFields.twitch_id],
      },
      amount: obtainableRecord[ObtainableFields.amount],
      context: obtainableRecord[ObtainableFields.context],
      isCollectible: obtainableRecord[ObtainableFields.is_collectible],
    };
  }
};
