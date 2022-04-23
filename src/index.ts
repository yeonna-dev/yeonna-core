require('dotenv').config();

import { createUserAndContextProvider } from './common/providers';
import { Identifiers, ItemsWithCodeAndAmount } from './common/types';
import * as bits from './modules/bits/actions';
import * as discord from './modules/discord/actions';
import * as items from './modules/items/actions';
import * as obtainables from './modules/obtainables/actions';
import * as streaks from './modules/streaks/actions';
import * as users from './modules/users/actions';

export * from './common/errors';

export class Core
{
  static Users = {
    ...users,
    ...obtainables,
  };

  static Bits = bits;
  static Discord = discord;
  static Streaks = streaks;

  static findUser = users.findUser;

  static getUserActions(identifiers: Identifiers)
  {
    const provideUserAndContext = createUserAndContextProvider(identifiers);

    return {
      getItems: () => provideUserAndContext(items.getUserItems),

      getCollections: () => provideUserAndContext(items.getUserCollections),

      obtainRandomItem: () => provideUserAndContext(
        items.obtainRandomItem,
        { createNonexistentUser: true },
      ),

      removeItems: (itemsToRemove: ItemsWithCodeAndAmount) =>
        provideUserAndContext((userId, context) =>
          items.removeUserItems({ userId, context, itemsToRemove })),

      checkForCollections: () => provideUserAndContext(items.checkForCollections),

      sellDuplicateItems: () => provideUserAndContext(items.sellDuplicateItems),

      sellAllItems: () => provideUserAndContext(items.sellAllItems),

      sellByCategory: (category: string) =>
        provideUserAndContext((userId, context) =>
          items.sellByCategory({ userId, context, category })),
    };
  };
}
