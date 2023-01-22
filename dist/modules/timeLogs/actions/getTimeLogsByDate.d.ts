import { Identifiers } from '../../../common/types';
declare type GetTimeLogsByDateParameters = Identifiers & {
    date?: Date | string;
};
export declare const getByDate: ({ date, ...identifiers }: GetTimeLogsByDateParameters) => Promise<import("../services/TimeLogService").TimeLog[] | undefined>;
export {};
//# sourceMappingURL=getTimeLogsByDate.d.ts.map