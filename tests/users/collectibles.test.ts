import 'mocha';
import assert from 'assert';

import
{
  getUserCollectibles,
  updateUserCollectibles,
  transferUserCollectibles,
  getTopCollectibles,
} from '../../src';

import { NotEnoughCollectibles } from '../../src/common/errors';
import { assertThrowsAsync } from '../helpers/assertThrowsAsync';

describe('User Collectibles', () =>
{
  const discordUser1 = '247955535620472844'; /* esfox316#2053 Discord ID */
  const twitchUser1 = '193202362'; /* esfox316 Twitch ID */

  const discordUser2 = '550362465905541132';  /* Botler#4197 Discord ID */
  const twitchUser2 = '19264788'; /* Nightbot Twitch ID */
  const updateAmount = 5;
  const addAmount = 1;

  const discordGuildID = '504135117296500746'; /* Yeonna server Discord ID */
  const twitchChannelID = '193202362'; /* esfox316 Twitch Channel ID */

  it('should get the collectibles of a Discord user in a Discord server', async () =>
    await getUserCollectibles({ userIdentifier: discordUser1, discordGuildID })
  );

  it('should get the collectibles of a Twitch user in a Twitch channel', async () =>
    await getUserCollectibles({ userIdentifier: twitchUser1, twitchChannelID })
  );

  it('should set the collectibles of a Discord user in a Discord server', async () =>
    await updateUserCollectibles({ userIdentifier: discordUser2, amount: updateAmount, discordGuildID })
  );

  it('should set the collectibles of a Twitch user in a Twitch channel', async () =>
    await updateUserCollectibles({ userIdentifier: twitchUser2, amount: updateAmount, twitchChannelID })
  );

  it('should add a collectible to a Discord user in a Discord server', async () =>
    await updateUserCollectibles({ userIdentifier: discordUser1, amount: addAmount, discordGuildID, add: true })
  );

  it('should add a collectible to a Twitch user in a Twitch channel', async () =>
    await updateUserCollectibles({ userIdentifier: twitchUser1, amount: addAmount, twitchChannelID, add: true })
  );

  it('should transfer the collectibles of a Discord user to another', async () =>
    await transferUserCollectibles({
      fromUserIdentifier: discordUser2,
      toUserIdentifier: discordUser1,
      amount: addAmount,
      discordGuildID,
    })
  );

  it('should transfer the collectibles of a Twitch user to another', async () =>
    await transferUserCollectibles({
      fromUserIdentifier: twitchUser2,
      toUserIdentifier: twitchUser1,
      amount: addAmount,
      twitchChannelID,
    })
  );

  it('should throw a NotEnoughCollectibles error', async () =>
    await assertThrowsAsync(
      async () =>
      {
        const sourcePoints = await getUserCollectibles({ userIdentifier: discordUser1, discordGuildID });
        await transferUserCollectibles({
          fromUserIdentifier: discordUser1,
          toUserIdentifier: discordUser2,
          amount: sourcePoints + 1,
          discordGuildID,
        });
      },
      new NotEnoughCollectibles(),
    )
  );

  it('should get the top user collectibles of a Discord server', async () =>
  {
    const topUsers = await getTopCollectibles({ count: 10, discordGuildID });
    assert.strictEqual(
      topUsers.every(user => user.userID && typeof user.points === 'number'),
      true,
    );
  });

  it('should get the top user collectibles of a Twitch channel', async () =>
  {
    const topUsers = await getTopCollectibles({ count: 10, twitchChannelID });
    assert.strictEqual(
      topUsers.every(user => user.userID && typeof user.points === 'number'),
      true,
    );
  });
});
