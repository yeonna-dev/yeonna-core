import * as usersActions from './modules/users/actions';
import * as itemsActions from './modules/items/actions';
import * as bitsActions from './modules/bits/actions';
import * as discordActions from './modules/discord/actions';
export * from './common/errors';
export declare class Core {
    static Users: typeof usersActions;
    static Items: typeof itemsActions;
    static Bits: typeof bitsActions;
    static Discord: typeof discordActions;
}
//# sourceMappingURL=index.d.ts.map