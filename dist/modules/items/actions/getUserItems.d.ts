import { Identifiers } from '../../../common/types';
export declare const getUserItems: ({ category, ...identifiers }: import("../../../common/types").ContextParameters & {
    userIdentifier: string;
} & {
    category?: string | undefined;
}) => Promise<import("../services/InventoriesService").InventoryItem[] | undefined>;
//# sourceMappingURL=getUserItems.d.ts.map