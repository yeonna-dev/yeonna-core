import 'mocha';

import
{
  updateUserPoints,
  getUserPoints,
} from '../../src';

describe('User Points', () =>
{
  const user = 'ba0c9d72-f1b6-4f67-8ce0-8ba718694386';
  const amount = 2000;
  const discordGuildID = '504135117296500746';

  it('should get the points of a user', async () =>
    await getUserPoints(user)
  );

  it('should add points to a user', async () =>
    await updateUserPoints({ user, amount, discordGuildID })
  );

  it('should set the points of a user', async () =>
    await updateUserPoints({ user, amount, discordGuildID, overwrite: true })
  );
});
