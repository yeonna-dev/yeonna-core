import { DB, TimestampedRecord } from '../../../common/DB';

export enum StreaksFields
{
  user_id = 'user_id',
  count = 'count',
  longest = 'longest',
  context = 'context',
  created_at = 'created_at',
  updated_at = 'updated_at',
};

export interface StreakRecord extends TimestampedRecord
{
  [StreaksFields.user_id]: string;
  [StreaksFields.count]: number;
  [StreaksFields.longest]: number;
  [StreaksFields.context]: string;
  [StreaksFields.created_at]: string;
  [StreaksFields.updated_at]: string;
}

export interface Streak
{
  userId: string;
  count: number;
  longest: number;
  context?: string;
  createdAt: string;
  updatedAt: string;
}

export class StreakService
{
  /* Table name is added here to be able to use in joins in other services. */
  static table = 'streaks';

  static async get({
    userId,
    context,
  }: {
    userId: string,
    context?: string,
  })
  {
    const query = DB.streaks()
      .where(StreaksFields.user_id, userId);

    if(context)
      query.and.where(StreaksFields.context, context);

    const streak = await query.first();
    if(!streak)
      return;

    return StreakService.serialize(streak);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async create({
    count,
    userId,
    context,
  }: {
    count: number,
    userId: string,
    context?: string,
  })
  {
    const [createdStreak] = await DB.streaks()
      .insert({
        [StreaksFields.user_id]: userId,
        [StreaksFields.count]: count,
        [StreaksFields.longest]: count,
        [StreaksFields.context]: context,
      })
      .returning('*');

    if(!createdStreak)
      return;

    return StreakService.serialize(createdStreak);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async update({
    userId,
    count,
    longest,
    context,
  }: {
    userId: string,
    count: number,
    longest?: number,
    context?: string,
  })
  {
    const updateData: {
      [StreaksFields.count]: number,
      [StreaksFields.updated_at]: any;
      [StreaksFields.longest]?: number;
    } = {
      [StreaksFields.count]: count,
      [StreaksFields.updated_at]: DB.knex.fn.now(),
    };

    if(longest)
      updateData[StreaksFields.longest] = longest;

    const query = DB.streaks()
      .where(StreaksFields.user_id, userId);

    if(context)
      query.and.where(StreaksFields.context, context);

    const [updatedStreak] = await query
      .update(updateData)
      .returning('*');

    if(!updatedStreak)
      return;

    return StreakService.serialize(updatedStreak);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(streak: StreakRecord): Streak
  {
    return ({
      userId: streak.user_id,
      count: streak.count,
      longest: streak.longest,
      context: streak.context,
      createdAt: streak.created_at,
      updatedAt: streak.updated_at,
    });
  }
};
