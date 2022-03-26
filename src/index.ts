require('dotenv').config();

import * as usersActions from './modules/users/actions';
import * as itemsActions from './modules/items/actions';
import * as bitsActions from './modules/bits/actions';
import * as discordActions from './modules/discord/actions';
import * as streakActions from './modules/streaks/actions';

export * from './common/errors';

export class Core
{
  static Users = usersActions;
  static Items = itemsActions;
  static Bits = bitsActions;
  static Discord = discordActions;
  static Streaks = streakActions;
}
