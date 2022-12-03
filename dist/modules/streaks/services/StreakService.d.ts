import { TimestampedRecord } from '../../../common/DB';
export declare enum StreakField {
    user_id = "user_id",
    count = "count",
    longest = "longest",
    context = "context",
    created_at = "created_at",
    updated_at = "updated_at"
}
export interface StreakRecord extends TimestampedRecord {
    [StreakField.user_id]: string;
    [StreakField.count]: number;
    [StreakField.longest]: number;
    [StreakField.context]: string;
    [StreakField.created_at]: string;
    [StreakField.updated_at]: string;
}
export interface Streak {
    userId: string;
    count: number;
    longest: number;
    context?: string;
    createdAt: string;
    updatedAt: string;
}
export declare class StreakService {
    static table: string;
    static get({ userId, context, }: {
        userId: string;
        context?: string;
    }): Promise<Streak | undefined>;
    static create({ count, userId, context, }: {
        count: number;
        userId: string;
        context?: string;
    }): Promise<Streak | undefined>;
    static update({ userId, count, longest, context, }: {
        userId: string;
        count: number;
        longest?: number;
        context?: string;
    }): Promise<Streak | undefined>;
    static serialize(streak: StreakRecord): Streak;
}
//# sourceMappingURL=StreakService.d.ts.map