import * as bits from './modules/bits/actions';
import * as discord from './modules/discord/actions';
import * as items from './modules/items/actions';
import * as obtainables from './modules/obtainables/actions';
import * as streaks from './modules/streaks/actions';
import * as timeLogs from './modules/timeLogs/actions';
import * as users from './modules/users/actions';
export * from './common/errors';
export declare class Core {
    static Users: typeof users;
    static Obtainables: typeof obtainables;
    static Items: typeof items;
    static Bits: typeof bits;
    static Discord: typeof discord;
    static Streaks: typeof streaks;
    static TimeLogs: typeof timeLogs;
}
//# sourceMappingURL=index.d.ts.map