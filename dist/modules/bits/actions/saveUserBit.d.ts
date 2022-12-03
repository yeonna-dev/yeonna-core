import { Identifiers } from '../../../common/types';
declare type SaveUserBitParameters = Identifiers & {
    content: string;
    tags?: string[];
};
export declare const saveUserBit: ({ content, tags, ...identifiers }: SaveUserBitParameters) => Promise<import("../services/UserBitService").UserBit | undefined>;
export {};
//# sourceMappingURL=saveUserBit.d.ts.map