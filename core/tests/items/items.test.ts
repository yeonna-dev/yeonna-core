import 'mocha';
import assert from 'assert';

import
{
  findUser,
  getUserItems,
  obtainRandomItem,
  removeUserItem,
} from '../../src';
import { InventoriesService } from '../../src/modules/items/services/InventoriesService';

describe('Items', function()
{
  this.timeout(20000);

  const userIdentifier = '247955535620472844';
  const discordGuildID = '504135117296500746';
  const itemCode = 'c';

  it('should add a random item to a Discord user inventory', async () =>
  {
    let item: any;

    while(! item)
    {
      item = await obtainRandomItem({
        userIdentifier,
        discordGuildID,
      });
    }

    if(typeof item !== 'object')
      assert.fail();
    else
      assert.notStrictEqual(item.code, undefined);
  });

  it('should add to a specific item in a Discord user inventory', async () =>
  {
    const userID = await findUser(userIdentifier);
    for(let i = 0; i < 2; i++)
      await InventoriesService.updateUserItem({
        itemCode,
        userID,
        context: 'discord:504135117296500746',
        add: true,
      });
  });

  it('should remove an item from a Discord user inventory', async () =>
    await removeUserItem({
      userIdentifier,
      itemCode,
      discordGuildID,
    })
  );

  it('should get the items of a Discord user', async () =>
  {
    const userItems = await getUserItems({ userIdentifier, discordGuildID });
    assert.deepStrictEqual(
      true,
      userItems.every(item => item.itemCode && item.amount && item.context),
    );
  });
});
