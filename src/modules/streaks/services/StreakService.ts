import { DB, TimestampedRecord } from '../../../common/DB';

export enum StreakField
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
  [StreakField.user_id]: string;
  [StreakField.count]: number;
  [StreakField.longest]: number;
  [StreakField.context]: string;
  [StreakField.created_at]: string;
  [StreakField.updated_at]: string;
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
      .where(StreakField.user_id, userId);

    if(context)
      query.and.where(StreakField.context, context);

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
        [StreakField.user_id]: userId,
        [StreakField.count]: count,
        [StreakField.longest]: count,
        [StreakField.context]: context,
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
      [StreakField.count]: number,
      [StreakField.updated_at]: any;
      [StreakField.longest]?: number;
    } = {
      [StreakField.count]: count,
      [StreakField.updated_at]: DB.knex.fn.now(),
    };

    if(longest)
      updateData[StreakField.longest] = longest;

    const query = DB.streaks()
      .where(StreakField.user_id, userId);

    if(context)
      query.and.where(StreakField.context, context);

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
