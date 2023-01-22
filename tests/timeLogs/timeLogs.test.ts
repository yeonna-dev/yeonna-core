import assert from 'assert';
import 'mocha';
import { Core } from '../../src';

describe('Time Logs', function()
{
  this.timeout(20000);

  const userIdentifier = '247955535620472844';
  const discordGuildId = '504135117296500746';

  const specificDate = '2023-01-04';
  const timeLogs = [
    {
      activity: 'Foo',
      datetime: new Date().toISOString(),
    },
    {
      activity: 'Bar',
      datetime: new Date().toISOString(),
    },
    {
      activity: 'Activity in date',
      datetime: new Date(specificDate).toISOString(),
    },
  ];

  let timeLogIds: string[] = [];

  it('should create time logs for a Discord user in a specific date', async () =>
  {
    let createdTimeLogs = await Core.TimeLogs.create({
      userIdentifier,
      discordGuildId,
      timeLogs,
    });

    timeLogIds = createdTimeLogs?.map(({ id }) => id) || [];

    assert.strictEqual(createdTimeLogs?.every(({ id, activity, datetime }, i) =>
      id.length === 15 &&
      activity === timeLogs[i].activity &&
      datetime === timeLogs[i].datetime),
      true,
    );
  });

  it('should get the time logs of a Discord user in a specific date', async () =>
  {
    const timeLogs = await Core.TimeLogs.getByDate({
      userIdentifier,
      discordGuildId,
      date: new Date(specificDate).toISOString(),
    });

    const [timeLog] = timeLogs || [];
    const timeLogDate = new Date(timeLog.datetime);
    const timeLogDatePart = timeLogDate.toISOString().substring(0, 10);

    assert.strictEqual(!!timeLogs, true);
    assert.strictEqual(timeLogDatePart, specificDate);
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
