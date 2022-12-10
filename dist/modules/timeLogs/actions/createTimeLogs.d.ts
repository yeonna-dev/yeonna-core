import { Identifiers } from '../../../common/types';
declare type CreateTimeLogsParameters = Identifiers & {
    timeLogs: {
        datetime: string;
        activity: string;
    }[];
};
export declare const create: ({ timeLogs, ...identifiers }: CreateTimeLogsParameters) => Promise<import("../services/TimeLogService").TimeLog[] | undefined>;
export {};
//# sourceMappingURL=createTimeLogs.d.ts.map