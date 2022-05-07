import { Identifiers, ItemsWithCodeAndAmount } from '../../../common/types';
export declare const removeUserItems: ({ itemsToRemove, ...identifiers }: import("../../../common/types").ContextParameters & {
    userIdentifier: string;
} & {
    itemsToRemove: ItemsWithCodeAndAmount;
}) => Promise<import("../services/InventoriesService").InventoryItem[] | undefined>;
//# sourceMappingURL=removeUserItems.d.ts.map