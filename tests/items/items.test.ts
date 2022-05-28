import assert from 'assert';
import 'mocha';
import { Core } from '../../src';
import { InventoriesService } from '../../src/modules/items/services/InventoriesService';

describe('Items', function()
{
  this.timeout(20000);

  const userIdentifier = '247955535620472844';
  const discordGuildId = '504135117296500746';

  it('should add a random item to a Discord user inventory', async () =>
  {
    let item: any;
    while(!item)
    {
      item = await Core.Items.obtainRandomItem({ userIdentifier, discordGuildId });
    }

    if(typeof item !== 'object')
      assert.fail();
    else
      assert.notStrictEqual(item.code, undefined);
  });

  it('should add specific items in a Discord user inventory', async () =>
  {
    const userId = await Core.Users.findUser(userIdentifier);
    await InventoriesService.addUserItems({
      userId,
      items: [
        {
          code: 'c',
          amount: 2,
        },
        {
          code: 'a',
          amount: 2,
        },
        {
          code: 'p',
          amount: 2,
        },
        {
          code: 'jkb',
          amount: 2,
        },
      ],
      context: 'discord:504135117296500746',
    });
  });

  it('should get the items of a Discord user', async () =>
  {
    const userItems = await Core.Items.getUserItems({ userIdentifier, discordGuildId });
    assert.deepStrictEqual(
      userItems.length !== 0 &&
      userItems.every(userItem =>
        userItem.code &&
        userItem.name &&
        userItem.amount !== undefined
      ),
      true,
    );
  });

  it('should get the items of a Discord user by category', async () =>
  {
    const category = 'Common';
    const userItems = await Core.Items.getUserItems({ userIdentifier, discordGuildId, category });
    assert.deepStrictEqual(
      userItems.length !== 0 &&
      userItems.every(userItem =>
        userItem.code &&
        userItem.name &&
        userItem.amount !== undefined &&
        userItem.category === category
      ),
      true,
    );
  });

  it('should remove an item from a Discord user inventory', async () =>
    await Core.Items.removeUserItems({
      userIdentifier,
      discordGuildId,
      itemsToRemove: [
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
      ]
    })
  );

  it('should sell duplicate items in a Discord user inventory', async () =>
  {
    const userPoints = await Core.Obtainables.getPoints({ userIdentifier, discordGuildId });
    const { sellPrice } = await Core.Items.sellDuplicateItems({ userIdentifier, discordGuildId });
    const userItems = await Core.Items.getUserItems({ userIdentifier, discordGuildId });
    const postSellUserPoints = await Core.Obtainables.getPoints({ userIdentifier, discordGuildId });

    assert.strictEqual(postSellUserPoints, userPoints + sellPrice);
    assert.strictEqual(userItems.every(({ amount }) => amount === 1 || amount === 0), true);
  });

  it('should sell all items of a category from a Discord user inventory', async () =>
  {
    const category = 'uncommon';
    const userPoints = await Core.Obtainables.getPoints({ userIdentifier, discordGuildId });
    const { sellPrice } = await Core.Items
      .sellByCategory({ userIdentifier, discordGuildId, category });

    const userItems = await Core.Items.getUserItems({ userIdentifier, discordGuildId });
    const postSellUserPoints = await Core.Obtainables.getPoints({ userIdentifier, discordGuildId });

    assert.strictEqual(
      userItems.length > 0 &&
      userItems.every(item => item.category !== category),
      true,
    );
    assert.strictEqual(postSellUserPoints, userPoints + sellPrice);
  });

  it('should sell all items from a Discord user inventory', async () =>
  {
    const userPoints = await Core.Obtainables.getPoints({ userIdentifier, discordGuildId });
    const { sellPrice } = await Core.Items.sellAllItems({ userIdentifier, discordGuildId });
    const userItems = await Core.Items.getUserItems({ userIdentifier, discordGuildId });
    const postSellUserPoints = await Core.Obtainables.getPoints({ userIdentifier, discordGuildId });

    assert.strictEqual(postSellUserPoints, userPoints + sellPrice);
    assert.strictEqual(userItems.length, 0);
  });
});
