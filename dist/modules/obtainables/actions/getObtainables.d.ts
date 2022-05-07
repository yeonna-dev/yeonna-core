import { Identifiers } from '../../../common/types';
export declare const getObtainables: ({ isCollectible, ...identifiers }: import("../../../common/types").ContextParameters & {
    userIdentifier: string;
} & {
    isCollectible?: boolean | undefined;
}) => Promise<number | undefined>;
export declare const getPoints: (identifiers: Identifiers) => Promise<number | undefined>;
export declare const getCollectibles: (identifiers: Identifiers) => Promise<number | undefined>;
//# sourceMappingURL=getObtainables.d.ts.map