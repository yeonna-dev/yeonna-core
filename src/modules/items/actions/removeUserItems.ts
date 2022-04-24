import { withUserAndContext } from '../../../common/providers';
import { Identifiers, ItemsWithCodeAndAmount } from '../../../common/types';
import { InventoriesService } from '../services/InventoriesService';

export const removeUserItems = ({
  itemsToRemove,
  ...identifiers
}: Identifiers & { itemsToRemove: ItemsWithCodeAndAmount; }) =>
  withUserAndContext(identifiers)(
    (userId, context) =>
      InventoriesService.removeUserItem({
        userId,
        context,
        items: itemsToRemove.map(({ code, amount }) => ({ code, amount })),
      })
  );
