import 'mocha';

import { addPointsToUser } from '../../src/modules/users/actions/addPointsToUser';
import { getDiscordUserPoints } from '../../src/modules/users/actions/getUserPoints';

const userDiscordID = '247955535620472844';
const points = 2000;

describe('Users', () =>
{
  it('should add points to a user', async () =>
    await addPointsToUser(userDiscordID, '504135117296500746', points));

  it('should get the points of a user', async () =>
  {
    await getDiscordUserPoints(userDiscordID);
  });
});
