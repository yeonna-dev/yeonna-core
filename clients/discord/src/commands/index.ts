import { Command } from 'comtroller';

import { ping } from './ping';
import { points } from './points';
import { addpoints } from './addpoints';

export const commands: Command[] =
[
  ping,
  points,
  addpoints,
];

