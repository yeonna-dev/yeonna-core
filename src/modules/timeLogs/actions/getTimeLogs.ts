import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { TimeLogService } from '../services/TimeLogService';

export const get = async (identifiers: Identifiers) => withUserAndContext(identifiers)(
  async (userId, context) => TimeLogService.get({ userId, context }),
  { createNonexistentUser: true },
);
