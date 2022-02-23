import 'mocha';
import assert from 'assert';

import { Core } from '../../src';

import { NotEnoughCollectibles } from '../../src/common/errors';
import { assertThrowsAsync } from '../helpers/assertThrowsAsync';

describe('Collectibles', function()
{
  this.timeout(20000);

  const discordUser1 = '247955535620472844'; /* esfox316#2053 Discord ID */
  const twitchUser1 = '193202362'; /* esfox316 Twitch ID */

  const discordUser2 = '550362465905541132';  /* Botler#4197 Discord ID */
  const twitchUser2 = '19264788'; /* Nightbot Twitch ID */
  const updateAmount = 5;
  const addAmount = 1;

  const discordGuildId = '504135117296500746'; /* Yeonna server Discord ID */
  const twitchChannelId = '193202362'; /* esfox316 Twitch Channel ID */

  it('should get the collectibles of a Discord user in a Discord server', async () =>
    await Core.Users.getCollectibles({ userIdentifier: discordUser1, discordGuildId })
  );

  it('should get the collectibles of a Twitch user in a Twitch channel', async () =>
    await Core.Users.getCollectibles({ userIdentifier: twitchUser1, twitchChannelId })
  );

  it('should set the collectibles of a Discord user in a Discord server', async () =>
    await Core.Users.updateCollectibles({ userIdentifier: discordUser2, amount: updateAmount, discordGuildId })
  );

  it('should set the collectibles of a Twitch user in a Twitch channel', async () =>
    await Core.Users.updateCollectibles({ userIdentifier: twitchUser2, amount: updateAmount, twitchChannelId })
  );

  it('should add a collectible to a Discord user in a Discord server', async () =>
    await Core.Users.updateCollectibles({ userIdentifier: discordUser1, amount: addAmount, discordGuildId, add: true })
  );

  it('should add a collectible to a Twitch user in a Twitch channel', async () =>
    await Core.Users.updateCollectibles({ userIdentifier: twitchUser1, amount: addAmount, twitchChannelId, add: true })
  );

  it('should transfer the collectibles of a Discord user to another', async () =>
    await Core.Users.transferUserCollectibles({
      fromUserIdentifier: discordUser2,
      toUserIdentifier: discordUser1,
      amount: addAmount,
      discordGuildId,
    })
  );

  it('should transfer the collectibles of a Twitch user to another', async () =>
    await Core.Users.transferUserCollectibles({
      fromUserIdentifier: twitchUser2,
      toUserIdentifier: twitchUser1,
      amount: addAmount,
      twitchChannelId,
    })
  );

  it('should throw a NotEnoughCollectibles error', async () =>
    await assertThrowsAsync(
      async () =>
      {
        const sourcePoints = await Core.Users.getCollectibles({ userIdentifier: discordUser1, discordGuildId });
        await Core.Users.transferUserCollectibles({
          fromUserIdentifier: discordUser1,
          toUserIdentifier: discordUser2,
          amount: sourcePoints + 1,
          discordGuildId,
        });
      },
      new NotEnoughCollectibles(),
    )
  );

  it('should get the top user collectibles of a Discord server', async () =>
  {
    const topUsers = await Core.Users.getTopCollectibles({ count: 10, discordGuildId });
    assert.strictEqual(
      topUsers.every(({ userId, amount }) => userId && typeof amount === 'number'),
      true,
    );
  });

  it('should get the top user collectibles of a Twitch channel', async () =>
  {
    const topUsers = await Core.Users.getTopCollectibles({ count: 10, twitchChannelId });
    assert.strictEqual(
      topUsers.every(({ userId, amount }) => userId && typeof amount === 'number'),
      true,
    );
  });
});
