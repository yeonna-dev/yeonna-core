import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { InventoryService } from '../services/InventoryService';

export const getUserItems = ({
  category,
  ...identifiers
}: Identifiers & { category?: string, }) =>
  withUserAndContext(identifiers)(
    (userId, context) => InventoryService.getUserItems({ userId, context, category })
  );
