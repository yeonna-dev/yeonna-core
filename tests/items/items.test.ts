import 'mocha';
import assert from 'assert';

import
{
  findUser,
  getUserItems,
  obtainRandomItem,
  removeUserItems,
} from '../../src';
import { InventoriesService } from '../../src/modules/items/services/InventoriesService';

describe('Items', function()
{
  this.timeout(20000);

  const userIdentifier = '247955535620472844';
  const discordGuildID = '504135117296500746';
  const itemCode = 'c';

  it('should get the items of a Discord user', async () =>
  {
    const userItems = await getUserItems({ userIdentifier, discordGuildID });
    assert.deepStrictEqual(
      true,
      userItems.every(item => item.code && item.name && item.amount !== undefined),
    );
  });

  it('should add a random item to a Discord user inventory', async () =>
  {
    let item: any;
    while(!item)
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
    const userId = await findUser(userIdentifier);
    await InventoriesService.addUserItems({
      userId,
      items: [
        {
          code: itemCode,
          amount: 2,
        },
      ],
      context: 'discord:504135117296500746',
    });
  });

  it('should remove an item from a Discord user inventory', async () =>
    await removeUserItems({
      userIdentifier,
      itemsToRemove:
        [
          {
            code: 'c',
            amount: 1,
          },
          {
            code: 'j',
            amount: 2,
          },
          {
            code: 'kng',
            amount: 1,
          },
        ],
      discordGuildID,
    })
  );
});
