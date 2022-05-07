import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { StreakService } from '../services/StreakService';

export const get = async (identifiers: Identifiers) => withUserAndContext(identifiers)(
  async (userId, context) => StreakService.get({ userId, context }),
  {
    requireContextParameters: true,
    createNonexistentUser: true,
  }
);
