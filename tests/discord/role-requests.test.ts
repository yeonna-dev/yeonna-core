import 'mocha';
import assert from 'assert';

import { Core, NonPendingRoleRequest } from '../../src';
import { assertThrowsAsync } from '../helpers/assertThrowsAsync';

describe('Role Requests', function()
{
  this.timeout(20000);

  const discordGuildId = '504135117296500746'; /* Yeonna server Discord ID */
  const requesterDiscordId = '247955535620472844'; /* esfox316#2053 Discord ID */
  let approvedRoleRequestId: string;
  let declinedRoleRequestId: string;

  function create()
  {
    return Core.Discord.createRoleRequest({
      discordGuildId,
      requesterDiscordId,
      roleName: 'test role',
      roleColor: '#ffffff',
    });
  }

  it('should create a role request', async () =>
  {
    const roleRequest = await create();
    assert.strictEqual(roleRequest.id !== undefined, true);
  });

  it('should create and approve a role request', async () =>
  {
    const roleRequest = await create();
    const approvedRoleRequest = await Core.Discord.approveRoleRequest({
      requestId: roleRequest.id,
      approverDiscordId: requesterDiscordId,
    });

    approvedRoleRequestId = approvedRoleRequest.id;
    assert.strictEqual(approvedRoleRequest.id !== undefined, true);
  });

  it('should create and decline a role request', async () =>
  {
    const roleRequest = await create();
    const declinedRoleRequest = await Core.Discord.declineRoleRequest({
      requestId: roleRequest.id,
      approverDiscordId: requesterDiscordId,
    });

    declinedRoleRequestId = declinedRoleRequest.id;
    assert.strictEqual(declinedRoleRequest.id !== undefined, true);
  });

  it('should not approve a non-pending role request', async () =>
    await assertThrowsAsync(
      async () =>
      {
        await Core.Discord.approveRoleRequest({
          requestId: declinedRoleRequestId,
          approverDiscordId: requesterDiscordId,
        });
      },
      new NonPendingRoleRequest(),
    )
  );

  it('should not decline a non-pending role request', async () =>
    await assertThrowsAsync(
      async () =>
      {
        await Core.Discord.declineRoleRequest({
          requestId: approvedRoleRequestId,
          approverDiscordId: requesterDiscordId,
        });
      },
      new NonPendingRoleRequest(),
    )
  );
});
