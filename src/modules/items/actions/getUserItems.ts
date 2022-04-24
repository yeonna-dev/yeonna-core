import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { InventoriesService } from '../services/InventoriesService';

export const getUserItems = (identifiers: Identifiers) =>
  withUserAndContext(identifiers)(
    (userId, context) => InventoriesService.getUserItems(userId, context)
  );
