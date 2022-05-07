import { Identifiers } from '../../../common/types';
import { InventoryItem } from '../services/InventoriesService';
export declare const sellDuplicateItems: (identifiers: Identifiers) => Promise<{
    sellPrice: number;
    soldItems: InventoryItem[];
} | undefined>;
export declare const sellAllItems: (identifiers: Identifiers) => Promise<{
    sellPrice: number;
    soldItems: InventoryItem[];
} | undefined>;
export declare const sellByCategory: ({ category, ...identifiers }: import("../../../common/types").ContextParameters & {
    userIdentifier: string;
} & {
    category: string;
}) => Promise<{
    sellPrice: number;
    soldItems: InventoryItem[];
} | undefined>;
//# sourceMappingURL=sell.d.ts.map