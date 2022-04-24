import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { CollectionsService } from '../services/CollectionsService';

export const getUserCollections = (identifiers: Identifiers) =>
  withUserAndContext(identifiers)(
    (userId, context) => CollectionsService.getCollections({ userId, context })
  );
