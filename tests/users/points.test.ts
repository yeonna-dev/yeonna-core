import 'mocha';
import assert from 'assert';

import
{
  getTopPoints,
  updateUserPoints,
  transferUserPoints,
  getUserPoints,
} from '../../src';

import { NotEnoughPoints } from '../../src/common/errors';
import { assertThrowsAsync } from '../helpers/assertThrowsAsync';

describe('User Points', () =>
{
  const discordUser1 = '247955535620472844'; /* esfox316#2053 Discord ID */
  const twitchUser1 = '193202362'; /* esfox316 Twitch ID */

  const discordUser2 = '550362465905541132';  /* Botler#4197 Discord ID */
  const twitchUser2 = '19264788'; /* Nightbot Twitch ID */
  const updateAmount = 500;
  const addAmount = 100;
  const transferAmount = 50;

  const discordGuildID = '504135117296500746'; /* Yeonna server Discord ID */
  const twitchChannelID = '193202362'; /* esfox316 Twitch Channel ID */

  it('should get the points of a Discord user in a Discord server', async () =>
    await getUserPoints({ userIdentifier: discordUser1, discordGuildID })
  );

  it('should get the points of a Twitch user in a Twitch channel', async () =>
    await getUserPoints({ userIdentifier: twitchUser1, twitchChannelID })
  );

  it('should set the points of a Discord user in a Discord server', async () =>
    await updateUserPoints({ userIdentifier: discordUser2, amount: updateAmount, discordGuildID })
  );

  it('should set the points of a Twitch user in a Twitch channel', async () =>
    await updateUserPoints({ userIdentifier: twitchUser2, amount: updateAmount, twitchChannelID })
  );

  it('should add points to a Discord user in a Discord server', async () =>
    await updateUserPoints({ userIdentifier: discordUser1, amount: addAmount, discordGuildID, add: true })
  );

  it('should add points to a Twitch user in a Twitch channel', async () =>
    await updateUserPoints({ userIdentifier: twitchUser1, amount: addAmount, twitchChannelID, add: true })
  );

  it('should transfer the points of a Discord user to another', async () =>
    await transferUserPoints({
      fromUserIdentifier: discordUser2,
      toUserIdentifier: discordUser1,
      amount: transferAmount,
      discordGuildID,
    })
  );

  it('should transfer the points of a Twitch user to another', async () =>
    await transferUserPoints({
      fromUserIdentifier: twitchUser2,
      toUserIdentifier: twitchUser1,
      amount: transferAmount,
      twitchChannelID,
    })
  );

  it('should throw a NotEnoughPoints error', async () =>
    await assertThrowsAsync(
      async () =>
      {
        const sourcePoints = await getUserPoints({ userIdentifier: discordUser1, discordGuildID });
        await transferUserPoints({
          fromUserIdentifier: discordUser1,
          toUserIdentifier: discordUser2,
          amount: sourcePoints + 1,
          discordGuildID,
        });
      },
      new NotEnoughPoints(),
    )
  );

  it('should get the top user points of a Discord server', async () =>
  {
    const topUsers = await getTopPoints({ count: 10, discordGuildID });
    assert.strictEqual(
      topUsers.every(user => user.userID && typeof user.points === 'number'),
      true,
    );
  });

  it('should get the top user points of a Twitch channel', async () =>
  {
    const topUsers = await getTopPoints({ count: 10, twitchChannelID });
    assert.strictEqual(
      topUsers.every(user => user.userID && typeof user.points === 'number'),
      true,
    );
  });
});
