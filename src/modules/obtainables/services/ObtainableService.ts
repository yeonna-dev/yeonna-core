import { DB, TimestampedRecord } from '../../../common/DB';
import { UserField, UserService } from '../../users/services/UserService';

export enum ObtainableField
{
  user_id = 'user_id',
  amount = 'amount',
  is_collectible = 'is_collectible',
  context = 'context',
}

export interface ObtainableRecord extends TimestampedRecord
{
  [ObtainableField.user_id]: string;
  [ObtainableField.amount]: number;
  [ObtainableField.is_collectible]?: boolean;
  [ObtainableField.context]?: string;

  /* Joined fields from `users` table */
  [UserField.discord_id]?: string;
  [UserField.twitch_id]?: string;
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

type CommonParams = {
  isCollectible?: boolean;
  context?: string;
};

export class ObtainableService
{
  static async find({
    userId,
    isCollectible,
    context,
  }: { userId: string; } & CommonParams)
  {
    const query = DB.obtainables()
      .where(ObtainableField.user_id, userId)
      .and.where(ObtainableField.is_collectible, Boolean(isCollectible));

    if(context)
      query.and.where(ObtainableField.context, context);

    const data = await query;
    const amount = data?.pop()?.amount;
    if(amount !== undefined)
      return Number(amount);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async getTop({
    count,
    isCollectible,
    context,
    withUsers,
  }: {
    count: number,
    withUsers?: boolean,
  } & CommonParams)
  {
    const query = DB.obtainables()
      .orderBy(ObtainableField.amount, 'desc')
      .where(ObtainableField.is_collectible, Boolean(isCollectible))
      .and.where(ObtainableField.amount, '>', 0)
      .limit(count);

    if(context)
      query.and.where(ObtainableField.context, context);

    if(withUsers)
      query.join(UserService.table, ObtainableField.user_id, UserField.id);

    const data = await query;
    return data.map(ObtainableService.serialize);
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
  } & CommonParams): Promise<Boolean>
  {
    /* Try to find the obtainable record with the given `userId`, `is_collectible`
      and `context` fields first before inserting to ensure of no duplicates. */
    const existingQuery = DB.obtainables()
      .where(ObtainableField.user_id, userId);

    if(isCollectible)
      existingQuery.and.where(ObtainableField.is_collectible, Boolean(isCollectible));

    if(context)
      existingQuery.and.where(ObtainableField.context, context);

    const existing = await existingQuery;
    if(existing.length > 0)
      return false;

    const insertData: ObtainableRecord =
    {
      [ObtainableField.user_id]: userId,
      [ObtainableField.amount]: amount,
      [ObtainableField.is_collectible]: isCollectible,
    };

    if(context)
      insertData[ObtainableField.context] = context;

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
    addAmount,
    isCollectible,
    context,
  }: {
    userId: string,
    amount?: number,
    addAmount?: number,
  } & CommonParams)
  {
    if(amount === undefined && addAmount === undefined)
      return;

    let updateExpression = `${amount}`;
    if(addAmount)
      updateExpression = `${ObtainableField.amount} + ${addAmount}`;

    const query = DB.obtainables()
      .update({ [ObtainableField.amount]: DB.knex.raw(updateExpression) })
      .returning('*')
      .where(ObtainableField.user_id, userId)
      .and.where(ObtainableField.is_collectible, Boolean(isCollectible));

    if(context)
      query.and.where(ObtainableField.context, context);

    const data = await query;
    const resultAmount = data?.pop()?.amount;
    if(resultAmount)
      return Number(resultAmount);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async reset({
    isCollectible,
    context,
  }: CommonParams)
  {
    const query = DB.obtainables()
      .update({ [ObtainableField.amount]: 0 })
      .returning('*')
      .where(ObtainableField.is_collectible, Boolean(isCollectible));

    if(context)
      query.and.where(ObtainableField.context, context);

    const data = await query;
    return data.map(ObtainableService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(obtainableRecord: ObtainableRecord): Obtainable
  {
    return {
      user:
      {
        id: obtainableRecord[ObtainableField.user_id],
        discordId: obtainableRecord[UserField.discord_id],
        twitchId: obtainableRecord[UserField.twitch_id],
      },
      amount: obtainableRecord[ObtainableField.amount],
      context: obtainableRecord[ObtainableField.context],
      isCollectible: obtainableRecord[ObtainableField.is_collectible],
    };
  }
};
