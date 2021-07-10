import 'mocha';
import assert from 'assert';

import { connectIDtoUser, findOrCreateUser, findUser } from '../../src';

describe('Users', () =>
{
  const discordUser1 = '247955535620472844'; /* esfox316#2053 Discord ID */
  const twitchUser1 = '193202362'; /* esfox316 Twitch ID */

  const discordUser2 = '550362465905541132';  /* Botler#4197 Discord ID */
  const twitchUser2 = '19264788'; /* Nightbot Twitch ID */

  it('should create a user with a Discord ID', async () =>
    await findOrCreateUser({ discordID: discordUser1 })
  );

  it('should create a user with a Twitch ID', async () =>
    await findOrCreateUser({ twitchID: twitchUser2 })
  );

  it('should find a user by a Discord ID', async () =>
  {
    const userID = await findUser(discordUser1);
    assert.notStrictEqual(userID, undefined);
  });

  it('should find a user by a Twitch ID', async () =>
  {
    const userID = await findUser(twitchUser2);
    assert.notStrictEqual(userID, undefined);
  });

  it('should connect a Discord ID to a user', async () =>
    await connectIDtoUser({
      userIdentifier: twitchUser2,
      newDiscordID: discordUser2,
    })
  );

  it('should connect a Twitch ID to a user', async () =>
    await connectIDtoUser({
      userIdentifier: discordUser1,
      newTwitchID: twitchUser1,
    })
  );
});
