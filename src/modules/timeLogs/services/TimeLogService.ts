import { DB, TimestampedRecord } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum TimeLogField
{
  id = 'id',
  datetime = 'datetime',
  activity = 'activity',
  user_id = 'user_id',
  context = 'context',
};

export interface TimeLogRecord extends TimestampedRecord
{
  [TimeLogField.id]: string;
  [TimeLogField.datetime]: Date;
  [TimeLogField.activity]: string;
  [TimeLogField.user_id]: string;
  [TimeLogField.context]: string;
}

export interface TimeLog
{
  id: string;
  datetime: string;
  activity: string;
  userId: string;
  context?: string;
}

export class TimeLogService
{
  static async get({
    userId,
    date,
    context,
  }: {
    userId: string,
    date?: Date | string,
    context?: string,
  })
  {
    const query = DB.timeLogs()
      .where(TimeLogField.user_id, userId);

    if(date)
    {
      let d;
      if(date instanceof Date)
        d = date;
      else
        d = new Date(date);

      const dateOnly = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      query.and.whereRaw('??::date = ?', [TimeLogField.datetime, dateOnly]);
    }

    if(context)
      query.and.where(TimeLogField.context, context);

    const timeLogs = await query;
    return timeLogs.map(TimeLogService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async create({
    userId,
    context,
    timeLogs,
  }: {
    userId: string,
    context?: string,
    timeLogs: {
      datetime: string,
      activity: string,
    }[],
  })
  {
    const timeLogsArray = !Array.isArray(timeLogs) ? [timeLogs] : timeLogs;
    const data = timeLogsArray.map((timeLog) => ({
      [TimeLogField.id]: nanoid(15),
      [TimeLogField.datetime]: timeLog.datetime,
      [TimeLogField.activity]: timeLog.activity,
      [TimeLogField.user_id]: userId,
      [TimeLogField.context]: context,
    }));

    const createdTimeLogs = await DB.timeLogs()
      .insert(data)
      .returning('*');

    if(!createdTimeLogs)
      return;

    return createdTimeLogs.map(TimeLogService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async remove({
    userId,
    context,
    timeLogIds,
  }: {
    userId: string,
    context?: string,
    timeLogIds: string | string[],
  })
  {
    const timeLogIdsArray = !Array.isArray(timeLogIds) ? [timeLogIds] : timeLogIds;
    let query = DB.timeLogs()
      .delete()
      .whereIn(TimeLogField.id, timeLogIdsArray)
      .and.where(TimeLogField.user_id, userId)
      .returning('*');

    if(context)
      query.and.where(TimeLogField.context, context);

    const deletedTimeLogs = await query;
    if(!deletedTimeLogs)
      return;

    return deletedTimeLogs.map(TimeLogService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(timeLogRecord: TimeLogRecord): TimeLog
  {
    return ({
      id: timeLogRecord[TimeLogField.id],
      datetime: timeLogRecord[TimeLogField.datetime].toISOString(),
      activity: timeLogRecord[TimeLogField.activity],
      userId: timeLogRecord[TimeLogField.user_id],
      context: timeLogRecord[TimeLogField.context],
    });
  }
};
