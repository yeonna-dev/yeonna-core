import 'mocha';
import assert from 'assert';
import { Core } from '../../src';
import { InventoriesService } from '../../src/modules/items/services/InventoriesService';
import { ContextUtil } from '../../src/common/ContextUtil';

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
    await Core.Items.checkForCollection({ userIdentifier, discordGuildId });
  });

  it('get the completed collections of a user', async () =>
  {
    const userCollections = await Core.Items.getUserCollections({ userIdentifier, discordGuildId });
    assert.strictEqual(
      userCollections.every(userCollection =>
        userCollection.userId && userCollection.collection.code
      ),
      true,
    );
  });
});
