import 'mocha';
import assert from 'assert';

import
{
  getUserCollectibles,
  updateUserCollectibles,
  transferUserCollectibles,
  getTopCollectibles,
} from '../../src';

import { assertThrowsAsync } from '../helpers/assertThrowsAsync';

import { NotEnoughPoints } from '../../src/common/errors';

describe('User Collectibles', () =>
{
  const user1 = 'ba0c9d72-f1b6-4f67-8ce0-8ba718694386';
  const user2 = '80914576-99fe-4871-94ae-4b4e872a9a8b';
  const amount = 1;
  const discordGuildID = '504135117296500746';

  it('should get the collectibles of a user', async () =>
    await getUserCollectibles({ userUUID: user1 })
  );

  it('should add a collectible to a user', async () =>
    await updateUserCollectibles({ userUUID: user1, amount, discordGuildID, add: true })
  );

  it('should set the collectibles of a user', async () =>
    await updateUserCollectibles({ userUUID: user2, amount: 5, discordGuildID })
  );

  it('should transfer the points of a user to another', async () =>
    await transferUserCollectibles({ fromUserUUID: user1, toUserUUID: user2, amount, discordGuildID })
  );

  it('should throw a NotEnoughPoints error', async () =>
    await assertThrowsAsync(
      async () =>
      {
        const sourcePoints = await getUserCollectibles({ userUUID: user1 });
        await transferUserCollectibles({
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
    const topUsers = await getTopCollectibles(10, discordGuildID);
    assert.strictEqual(
      topUsers.every(user => user.userUUID && typeof user.points === 'number'),
      true,
    );
  });
});
