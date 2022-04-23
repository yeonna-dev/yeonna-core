import { ItemsWithCodeAndAmount } from '../../../common/types';
import { InventoriesService } from '../services/InventoriesService';

export const removeUserItems = ({
  userId,
  context,
  itemsToRemove,
}: {
  userId: string,
  context?: string,
  itemsToRemove: ItemsWithCodeAndAmount,
}) =>
  InventoriesService.removeUserItem({
    userId,
    items: itemsToRemove.map(({ code, amount }) => ({ code, amount })),
    context,
  });
