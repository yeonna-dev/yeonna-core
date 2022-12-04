import { DB, TimestampedRecord } from '../../../common/DB';

export enum TimeLogField
{
  datetime = 'datetime',
  activity = 'activity',
  user_id = 'user_id',
  context = 'context',
};

export interface TimeLogRecord extends TimestampedRecord
{
  [TimeLogField.datetime]: string;
  [TimeLogField.activity]: string;
  [TimeLogField.user_id]: string;
  [TimeLogField.context]: string;
}

export interface TimeLog
{
  datetime: string;
  activity: string;
  userId: string;
  context?: string;
}

export class TimeLogService
{
  static async getUserTimeLogs({
    userId,
    context,
  }: {
    userId: string,
    context?: string,
  })
  {
    const query = DB.timeLogs()
      .where(TimeLogField.user_id, userId);

    if(context)
      query.and.where(TimeLogField.context, context);

    const timeLogs = await query;
    return timeLogs.map(TimeLogService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async create(timeLog: TimeLog)
  {
    const [createdStreak] = await DB.timeLogs()
      .insert({
        [TimeLogField.datetime]: timeLog.datetime,
        [TimeLogField.activity]: timeLog.activity,
        [TimeLogField.user_id]: timeLog.userId,
        [TimeLogField.context]: timeLog.context,
      })
      .returning('*');

    if(!createdStreak)
      return;

    return TimeLogService.serialize(createdStreak);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(timeLogRecord: TimeLogRecord): TimeLog
  {
    return ({
      datetime: timeLogRecord.datetime,
      activity: timeLogRecord.activity,
      userId: timeLogRecord.user_id,
      context: timeLogRecord.context,
    });
  }
};
