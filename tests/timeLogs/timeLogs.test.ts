import assert from 'assert';
import 'mocha';
import { Core } from '../../src';

describe('Time Logs', function()
{
  this.timeout(20000);

  const userIdentifier = '247955535620472844';
  const discordGuildId = '504135117296500746';

  const timeLogs = [
    {
      activity: 'Foo',
      datetime: new Date().toISOString(),
    },
    {
      activity: 'Bar',
      datetime: new Date().toISOString(),
    },
  ];

  let timeLogIds: string[] = [];

  it('should create time logs for a Discord user', async () =>
  {
    let createdTimeLogs = await Core.TimeLogs.create({
      userIdentifier,
      discordGuildId,
      timeLogs
    });

    timeLogIds = createdTimeLogs?.map(({ id }) => id) || [];

    assert.strictEqual(createdTimeLogs?.every(({ id, activity, datetime }, i) =>
      id.length === 15 &&
      activity === timeLogs[i].activity &&
      datetime === timeLogs[i].datetime),
      true,
    );
  });

  it('should get the time logs of a Discord user', async () =>
  {
    const timeLogs = await Core.TimeLogs.get({
      userIdentifier,
      discordGuildId,
    });

    assert.strictEqual(!!timeLogs, true);
  });

  it('should delete the time logs of a Discord user', async () =>
  {
    let deletedTimeLogs = await Core.TimeLogs.remove({
      userIdentifier,
      discordGuildId,
      timeLogIds
    });

    assert.strictEqual(deletedTimeLogs?.length, timeLogIds.length);
    assert.strictEqual(deletedTimeLogs?.every(({ id }, i) => id === timeLogIds[i]), true);
  });
});
