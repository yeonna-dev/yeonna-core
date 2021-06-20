import 'mocha';
import assert from 'assert';

import
{
  updateUserPoints,
  getUserPoints,
  transferUserPoints,
  getTopPoints,
} from '../../src';

import { assertThrowsAsync } from '../helpers/assertThrowsAsync';

import { NotEnoughPoints } from '../../src/common/errors';

describe('User Points', () =>
{
  const user = 'ba0c9d72-f1b6-4f67-8ce0-8ba718694386';
  const receiverUser = '80914576-99fe-4871-94ae-4b4e872a9a8b';
  const amount = 2000;
  const discordGuildID = '504135117296500746';

  it('should get the points of a user', async () =>
    await getUserPoints(user)
  );

  it('should add points to a user', async () =>
    await updateUserPoints({ user, amount, discordGuildID, add: true })
  );

  it('should set the points of a user', async () =>
    await updateUserPoints({ user, amount, discordGuildID })
  );

  it('should transfer the points of a user to another', async () =>
    await transferUserPoints(user, receiverUser, 1)
  );

  it('should throw a NotEnoughPoints error', async () =>
    await assertThrowsAsync(
      async () =>
      {
        const sourcePoints = await getUserPoints(user);
        await transferUserPoints(user, receiverUser, sourcePoints + 1);
      },
      new NotEnoughPoints(),
    )
  );

  it('should get the top user points', async () =>
  {
    const count = 5;
    const topUsers = await getTopPoints(count, discordGuildID);
    assert.strictEqual(topUsers.length, count);
    assert.strictEqual(topUsers.every(user => user.userUUID && user.points), true);
  });
});
