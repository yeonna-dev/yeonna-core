import 'mocha';
import assert from 'assert';

import
{
  saveUserBit,
  findUserBits,
  removeUserBits,
} from '../../src';

describe('Bits', function()
{
  this.timeout(20000);

  const discordUser1 = '247955535620472844'; /* esfox#2053 Discord ID */
  let createdBitId;

  it('should create a bit with tags for a user', async () =>
  {
    const createdBit = await saveUserBit({
      userIdentifier: discordUser1,
      content: 'test-content',
      tags: ['Fox', 'Dog'],
      discordGuildId: '504135117296500746',
    });

    createdBitId = createdBit.bit.id;
  });

  it('should get the bits of a user', async () =>
  {
    const data = await findUserBits({ userIdentifier: discordUser1 });
    assert.strictEqual(true, data.every(userBit => userBit.user && userBit.bit));
  });

  it('should search the bits of a user', async () =>
  {
    const search = 'test';
    const data = await findUserBits({ userIdentifier: discordUser1, search });
    assert.strictEqual(true, data.every(userBit => userBit.bit.content.includes(search)));
  });

  it('should remove the bit of the user', async () =>
  {
    const data = await removeUserBits({ userIdentifier: discordUser1, bitId: createdBitId });
    assert.strictEqual(true, data.every(userBit => userBit.bitId === createdBitId));
  });
});
