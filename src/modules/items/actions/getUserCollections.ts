import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { CollectionService } from '../services/CollectionService';

export const getUserCollections = (identifiers: Identifiers) =>
  withUserAndContext(identifiers)(
    (userId, context) => CollectionService.getCollections({ userId, context })
  );
