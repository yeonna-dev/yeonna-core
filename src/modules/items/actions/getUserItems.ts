import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { InventoriesService } from '../services/InventoriesService';

export const getUserItems = ({
  category,
  ...identifiers
}: Identifiers & { category?: string, }) =>
  withUserAndContext(identifiers)(
    (userId, context) => InventoriesService.getUserItems({ userId, context, category })
  );
