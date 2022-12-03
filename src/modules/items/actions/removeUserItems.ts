import { withUserAndContext } from '../../../common/providers';
import { Identifiers, ItemsWithCodeAndAmount } from '../../../common/types';
import { InventoryService } from '../services/InventoryService';

export const removeUserItems = ({
  itemsToRemove,
  ...identifiers
}: Identifiers & { itemsToRemove: ItemsWithCodeAndAmount; }) =>
  withUserAndContext(identifiers)(
    (userId, context) =>
      InventoryService.removeUserItem({
        userId,
        context,
        items: itemsToRemove.map(({ code, amount }) => ({ code, amount })),
      })
  );
