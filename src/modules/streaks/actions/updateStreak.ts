import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { StreakService } from '../services/StreakService';

type UpdateStreakParameters = Identifiers &
{
  count?: number,
  increment?: boolean,
  decrement?: boolean,
};

export const update = async ({
  count,
  increment,
  decrement,
  ...identifiers
}: UpdateStreakParameters) => withUserAndContext(identifiers)(
  async (userId, context) =>
  {
    const existingStreak = await StreakService.get({ userId, context });
    const currentStreakCount = existingStreak?.count || 0;
    if(!count)
    {
      if(increment)
        count = currentStreakCount + 1;
      else if(decrement)
        count = currentStreakCount - 1;
      else
        count = 0;
    }

    if(count < 0)
      count = 0;

    let longest;
    if(count > (existingStreak?.longest || 0))
      longest = count;

    const newStreak = existingStreak
      ? await StreakService.update({ userId, context, count, longest })
      : await StreakService.create({ userId, context, count });

    if(!newStreak)
      return;

    return {
      current: newStreak,
      previous: existingStreak,
    };
  },
  {
    requireContextParameters: true,
    createNonexistentUser: true,
  }
);
