import 'mocha';
import assert from 'assert';
import { Core } from '../../src';

describe('Streaks', function()
{
  this.timeout(20000);

  const userIdentifier = '247955535620472844';
  const discordGuildId = '504135117296500746';
  let initialStreakCount = 10;
  let currentStreakCount;

  it('should get the streak of a Discord user', async () =>
  {
    const streak = await Core.Streaks.get({
      userIdentifier,
      discordGuildId,
    });

    assert.strictEqual(!!streak, true);
  });

  it('should update the streak of a Discord user', async () =>
  {
    const updatedStreak = await Core.Streaks.update({
      count: initialStreakCount,
      userIdentifier,
      discordGuildId,
    });

    currentStreakCount = updatedStreak.count;

    assert.strictEqual(updatedStreak.count, initialStreakCount);
  });

  it('should increment the streak of a Discord user', async () =>
  {
    const updatedStreak = await Core.Streaks.update({
      increment: true,
      userIdentifier,
      discordGuildId,
    });

    assert.strictEqual(updatedStreak.count, currentStreakCount + 1);
  });
});
