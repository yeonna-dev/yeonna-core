import { Command } from 'comtroller';

import { ping } from './ping';
import { points } from './points';
import { addpoints } from './addpoints';
import { setpoints } from './setpoints';

export const commands: Command[] =
[
  ping,
  points,
  addpoints,
  setpoints,
];
