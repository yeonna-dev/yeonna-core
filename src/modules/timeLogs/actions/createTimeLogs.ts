import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { TimeLogService } from '../services/TimeLogService';

type CreateTimeLogsParameters = Identifiers &
{
  timeLogs: {
    datetime: string;
    activity: string;
  }[];
};

export const create = async ({
  timeLogs,
  ...identifiers
}: CreateTimeLogsParameters) => withUserAndContext(identifiers)(
  async (userId, context) =>
  {
    const timeLogsData = timeLogs.map(({ datetime, activity }) => ({
      datetime,
      activity,
    }));

    return TimeLogService.create({
      userId,
      context,
      timeLogs: timeLogsData,
    });
  },
  { createNonexistentUser: true },
);
