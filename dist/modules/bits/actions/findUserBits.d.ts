import { Identifiers } from '../../../common/types';
declare type FindUserBitsParameters = Identifiers & {
    search?: string;
};
export declare const findUserBits: ({ search, ...identifiers }: FindUserBitsParameters) => Promise<import("../services/UserBitService").UserBit[] | undefined>;
export {};
//# sourceMappingURL=findUserBits.d.ts.map