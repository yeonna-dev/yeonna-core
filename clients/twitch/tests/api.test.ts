import 'mocha';
import assert from 'assert';

import { API } from '../src/api';

describe('Twitch API Client', function()
{
  this.timeout(20000);

  it('should get users by username', async () =>
  {
    const usernames = [ 'esfox316', 'xjabee' ];
    const users = await API.getUsersByNames(usernames);
    assert.strictEqual(true, users.every(({ id }) => id));
  });

  it('should get a user by username', async () =>
  {
    const user = await API.getUserByName('esfox316');
    assert.strictEqual(true, !! user && user.id !== undefined);
  });
});
