import 'mocha';
import assert from 'assert';

import
{
  saveUserBit,
  findUserBits,
  removeUserBits,
} from '../../src';

describe('Bits', () =>
{
  const discordUser1 = '247955535620472844'; /* esfox316#2053 Discord ID */
  let createdBitID;
  // const twitchUser1 = '193202362'; /* esfox316 Twitch ID */

  it('should create a bit for a user', async () =>
  {
    const createdBit = await saveUserBit({
      userIdentifier: discordUser1,
      content: 'test-content',
    });

    createdBitID = createdBit.bit.id;
  });

  it('should get the bits of a user', async () =>
  {
    const data = await findUserBits({ userIdentifier: discordUser1 });
    assert.strictEqual(true, data.every(userBit => userBit.bit));
  });

  it('should search the bits of a user', async () =>
  {
    const search = 'test';
    const data = await findUserBits({ userIdentifier: discordUser1, search });
    assert.strictEqual(true, data.every(userBit => userBit.bit.content.includes(search)));
  });

  it('should remove the bit of the user', async () =>
  {
    const data = await removeUserBits({ userIdentifier: discordUser1, bitID: createdBitID });
    assert.strictEqual(true, data.every(userBit => userBit.bit.id === createdBitID));
  });
});
