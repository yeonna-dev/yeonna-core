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
  const user1 = 'ba0c9d72-f1b6-4f67-8ce0-8ba718694386';
  const user2 = '80914576-99fe-4871-94ae-4b4e872a9a8b';
  const amount = 100;
  const discordGuildID = '504135117296500746';

  it('should get the points of a user', async () =>
    await getUserPoints({ userUUID: user1 })
  );

  it('should add points to a user', async () =>
    await updateUserPoints({ userUUID: user1, amount, discordGuildID, add: true })
  );

  it('should set the points of a user', async () =>
    await updateUserPoints({ userUUID: user2, amount, discordGuildID })
  );

  it('should transfer the points of a user to another', async () =>
    await transferUserPoints({ fromUserUUID: user1, toUserUUID: user2, amount, discordGuildID })
  );

  it('should throw a NotEnoughPoints error', async () =>
    await assertThrowsAsync(
      async () =>
      {
        const sourcePoints = await getUserPoints({ userUUID: user1 });
        await transferUserPoints({
          fromUserUUID: user1,
          toUserUUID: user2,
          amount: sourcePoints + 1,
          discordGuildID,
        });
      },
      new NotEnoughPoints(),
    )
  );

  it('should get the top user points', async () =>
  {
    const topUsers = await getTopPoints(10, discordGuildID);
    assert.strictEqual(
      topUsers.every(user => user.userUUID && typeof user.points === 'number'),
      true,
    );
  });
});
