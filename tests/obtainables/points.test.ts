import assert from 'assert';
import 'mocha';
import { Core } from '../../src';
import { NotEnoughPoints } from '../../src/common/errors';
import { assertThrowsAsync } from '../helpers/assertThrowsAsync';

describe('Points', function()
{
  this.timeout(20000);

  const discordUser1 = '247955535620472844'; /* esfox316#2053 Discord ID */
  const twitchUser1 = '193202362'; /* esfox316 Twitch ID */

  const discordUser2 = '550362465905541132';  /* Botler#4197 Discord ID */
  const twitchUser2 = '19264788'; /* Nightbot Twitch ID */
  const updateAmount = 500;
  const addAmount = 100;
  const transferAmount = 50;

  const discordGuildId = '504135117296500746'; /* Yeonna server Discord ID */
  const twitchChannelId = '193202362'; /* esfox316 Twitch Channel ID */

  it('should get the points of a Discord user in a Discord server', async () =>
    await Core.Obtainables.getPoints({ userIdentifier: discordUser1, discordGuildId })
  );

  it('should get the points of a Twitch user in a Twitch channel', async () =>
    await Core.Obtainables.getPoints({ userIdentifier: twitchUser1, twitchChannelId })
  );

  it('should set the points of a Discord user in a Discord server', async () =>
    await Core.Obtainables.updatePoints({
      userIdentifier: discordUser2,
      amount: updateAmount,
      discordGuildId,
    })
  );

  it('should set the points of a Twitch user in a Twitch channel', async () =>
    await Core.Obtainables.updatePoints({
      userIdentifier: twitchUser2,
      amount: updateAmount,
      twitchChannelId,
    })
  );

  it('should add points to a Discord user in a Discord server', async () =>
    await Core.Obtainables.updatePoints({
      userIdentifier: discordUser1,
      amount: addAmount,
      discordGuildId,
      add: true,
    })
  );

  it('should add points to a Twitch user in a Twitch channel', async () =>
    await Core.Obtainables.updatePoints({
      userIdentifier: twitchUser1,
      amount: addAmount,
      twitchChannelId,
      add: true,
    })
  );

  it('should transfer the points of a Discord user to another', async () =>
    await Core.Obtainables.transferUserPoints({
      fromUserIdentifier: discordUser2,
      toUserIdentifier: discordUser1,
      amount: transferAmount,
      discordGuildId,
    })
  );

  it('should transfer the points of a Twitch user to another', async () =>
    await Core.Obtainables.transferUserPoints({
      fromUserIdentifier: twitchUser2,
      toUserIdentifier: twitchUser1,
      amount: transferAmount,
      twitchChannelId,
    })
  );

  it('should throw a NotEnoughPoints error', async () =>
    await assertThrowsAsync(
      async () =>
      {
        let sourcePoints = await Core.Obtainables.getPoints({
          userIdentifier: discordUser1,
          discordGuildId,
        });
        sourcePoints = sourcePoints || 0;

        await Core.Obtainables.transferUserPoints({
          fromUserIdentifier: discordUser1,
          toUserIdentifier: discordUser2,
          amount: sourcePoints + 1,
          discordGuildId,
        });
      },
      new NotEnoughPoints(),
    )
  );

  it('should get the top user points of a Discord server', async () =>
  {
    const topUsers = await Core.Obtainables.getTopPoints({ count: 10, discordGuildId });
    assert.strictEqual(
      topUsers?.every(({ userId, amount }) => userId && typeof amount === 'number'),
      true,
    );
  });

  it('should get the top user points of a Twitch channel', async () =>
  {
    const topUsers = await Core.Obtainables.getTopPoints({ count: 10, twitchChannelId });
    assert.strictEqual(
      topUsers?.every(({ userId, amount }) => userId && typeof amount === 'number'),
      true,
    );
  });
});
