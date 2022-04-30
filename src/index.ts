require('dotenv').config();

import * as bits from './modules/bits/actions';
import * as discord from './modules/discord/actions';
import * as items from './modules/items/actions';
import * as obtainables from './modules/obtainables/actions';
import * as streaks from './modules/streaks/actions';
import * as users from './modules/users/actions';

export * from './common/errors';

export class Core
{
  static Users = users;
  static Obtainables = obtainables;
  static Items = items;
  static Bits = bits;
  static Discord = discord;
  static Streaks = streaks;
}
