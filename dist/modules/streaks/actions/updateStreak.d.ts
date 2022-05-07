import { Identifiers } from '../../../common/types';
declare type UpdateStreakParameters = Identifiers & {
    count?: number;
    increment?: boolean;
    decrement?: boolean;
};
export declare const update: ({ count, increment, decrement, ...identifiers }: UpdateStreakParameters) => Promise<{
    current: import("../services/StreakService").Streak;
    previous: import("../services/StreakService").Streak | undefined;
} | undefined>;
export {};
//# sourceMappingURL=updateStreak.d.ts.map