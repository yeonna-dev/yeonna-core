import 'mocha';
import assert from 'assert';

import { addPointsToUser } from '../../src/modules/users/actions/addPointsToUser';
import { getDiscordUserPoints } from '../../src/modules/users/actions/getUserPoints';

const userDiscordID = '247955535620472844';
const points = 2000;

describe('Users', () =>
{
  it('should not throw an error', async () =>
    await addPointsToUser(userDiscordID, '504135117296500746', points));

  // it('should match the points of the created user', async () =>
  // {
  //   const userPoints = await getDiscordUserPoints(userDiscordID);
  //   assert.strictEqual(userPoints, points);
  // });
});
