import assert from 'assert';
import 'mocha';
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
    let updateResult = await Core.Streaks.update({
      count: initialStreakCount,
      userIdentifier,
      discordGuildId,
    });

    let { current } = updateResult || {};
    currentStreakCount = current?.count;

    assert.strictEqual(currentStreakCount, initialStreakCount);
  });

  it('should increment the streak of a Discord user', async () =>
  {
    let updateResult = await Core.Streaks.update({
      increment: true,
      userIdentifier,
      discordGuildId,
    });
    let { current } = updateResult || {};

    const incremented = currentStreakCount + 1;
    currentStreakCount = current?.count;
    assert.strictEqual(current?.count, incremented);
  });

  it('should decrement the streak of a Discord user', async () =>
  {
    let updateResult = await Core.Streaks.update({
      decrement: true,
      userIdentifier,
      discordGuildId,
    });
    let { current } = updateResult || {};

    const decremented = currentStreakCount - 1;
    currentStreakCount = current?.count;
    assert.strictEqual(current?.count, decremented);
  });
});
