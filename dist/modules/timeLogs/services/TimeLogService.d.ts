import { TimestampedRecord } from '../../../common/DB';
export declare enum TimeLogField {
    id = "id",
    datetime = "datetime",
    activity = "activity",
    user_id = "user_id",
    context = "context"
}
export interface TimeLogRecord extends TimestampedRecord {
    [TimeLogField.id]: string;
    [TimeLogField.datetime]: Date;
    [TimeLogField.activity]: string;
    [TimeLogField.user_id]: string;
    [TimeLogField.context]: string;
}
export interface TimeLog {
    id: string;
    datetime: string;
    activity: string;
    userId: string;
    context?: string;
}
export declare class TimeLogService {
    static get({ userId, context, }: {
        userId: string;
        context?: string;
    }): Promise<TimeLog[]>;
    static create({ userId, context, timeLogs, }: {
        userId: string;
        context?: string;
        timeLogs: {
            datetime: string;
            activity: string;
        }[];
    }): Promise<TimeLog[] | undefined>;
    static remove({ userId, context, timeLogIds, }: {
        userId: string;
        context?: string;
        timeLogIds: string | string[];
    }): Promise<TimeLog[] | undefined>;
    static serialize(timeLogRecord: TimeLogRecord): TimeLog;
}
//# sourceMappingURL=TimeLogService.d.ts.map