import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { TimeLogService } from '../services/TimeLogService';

type GetTimeLogsByDateParameters = Identifiers & { date?: Date | string; };

export const getByDate = async ({ date, ...identifiers }: GetTimeLogsByDateParameters) =>
  withUserAndContext(identifiers)(
    async (userId, context) => TimeLogService.get({ userId, context, date }),
    { createNonexistentUser: true },
  );
