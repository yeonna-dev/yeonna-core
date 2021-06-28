import 'mocha';
import assert from 'assert';

import { connectIDtoUser, findUserByID } from '../../src';

describe('Users', () =>
{
  const discordUser1 = '247955535620472844'; /* esfox316#2053 Discord ID */
  const twitchUser1 = '193202362'; /* esfox316 Twitch ID */

  const discordUser2 = '550362465905541132';  /* Botler#4197 Discord ID */
  const twitchUser2 = '19264788'; /* Nightbot Twitch ID */

  it('should create a user with a Discord ID', async () =>
    await findUserByID({ discordID: discordUser1, createIfNotExisting: true })
  );

  it('should create a user with a Twitch ID', async () =>
    await findUserByID({ twitchID: twitchUser2, createIfNotExisting: true })
  );

  it('should find a user by a Discord ID', async () =>
  {
    const userUUID = await findUserByID({ discordID: discordUser1 });
    assert.notStrictEqual(userUUID, undefined);
  });

  it('should find a user by a Twitch ID', async () =>
  {
    const userUUID = await findUserByID({ twitchID: twitchUser2 });
    assert.notStrictEqual(userUUID, undefined);
  });

  it('should connect a Discord ID to a user', async () =>
    await connectIDtoUser({
      twitchID: twitchUser2,
      newDiscordID: discordUser2,
    })
  );

  it('should connect a Twitch ID to a user', async () =>
    await connectIDtoUser({
      discordID: discordUser1,
      newTwitchID: twitchUser1,
    })
  );
});
