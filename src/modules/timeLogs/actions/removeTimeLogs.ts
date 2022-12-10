import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { TimeLogService } from '../services/TimeLogService';

export const remove = async ({
  timeLogIds,
  ...identifiers
}: Identifiers & { timeLogIds: string[]; }) => withUserAndContext(identifiers)(
  async (userId, context) => TimeLogService.remove({ userId, context, timeLogIds }),
  { createNonexistentUser: true },
);
