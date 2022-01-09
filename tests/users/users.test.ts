import 'mocha';
import assert from 'assert';

import { Core } from '../../src';

describe('Users', function()
{
  this.timeout(20000);

  const discordUser1 = '247955535620472844'; /* esfox316#2053 Discord ID */
  const twitchUser1 = '193202362'; /* esfox316 Twitch ID */

  const discordUser2 = '550362465905541132';  /* Botler#4197 Discord ID */
  const twitchUser2 = '19264788'; /* Nightbot Twitch ID */

  const discordGuildId = '504135117296500746'; /* Yeonna server Discord ID */
  const twitchChannelId = '193202362'; /* esfox316 Twitch Channel ID */

  it('should create a user with a Discord ID', async () =>
    await Core.Users.findOrCreateUser({ userIdentifier: discordUser1, discordGuildId })
  );

  it('should create a user with a Twitch ID', async () =>
    await Core.Users.findOrCreateUser({ userIdentifier: twitchUser2, twitchChannelId })
  );

  it('should find a user by a Discord ID', async () =>
  {
    const userId = await Core.Users.findUser(discordUser1);
    assert.notStrictEqual(userId, undefined);
  });

  it('should find a user by a Twitch ID', async () =>
  {
    const userId = await Core.Users.findUser(twitchUser2);
    assert.notStrictEqual(userId, undefined);
  });

  it('should connect a Discord ID to a user', async () =>
    await Core.Users.connectIdToUser({
      userIdentifier: twitchUser2,
      newDiscordId: discordUser2,
    })
  );

  it('should connect a Twitch ID to a user', async () =>
    await Core.Users.connectIdToUser({
      userIdentifier: discordUser1,
      newTwitchId: twitchUser1,
    })
  );
});
