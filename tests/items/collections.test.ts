import assert from 'assert';
import 'mocha';
import { Core } from '../../src';
import { ContextUtil } from '../../src/common/ContextUtil';
import { InventoriesService } from '../../src/modules/items/services/InventoriesService';

describe('Collections', function()
{
  this.timeout(20000);

  const userIdentifier = '247955535620472844';
  const discordGuildId = '504135117296500746';

  it('should complete the specified collection for a user', async () =>
  {
    const userId = await Core.Users.findUser(userIdentifier);
    const context = ContextUtil.createContext({ discordGuildId });
    await InventoriesService.addUserItems({
      userId,
      items: [{ code: 'c' }, { code: 'j' }, { code: 'sb' }],
      context,
    });
    await Core.getUserActions({ userIdentifier, discordGuildId }).checkForCollections();
  });

  it('get the completed collections of a user', async () =>
  {
    const userCollections = await Core
      .getUserActions({ userIdentifier, discordGuildId })
      .getCollections();

    assert.strictEqual(
      userCollections.every(userCollection =>
        userCollection.userId && userCollection.code
      ),
      true,
    );
  });
});
