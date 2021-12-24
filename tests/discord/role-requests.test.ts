import 'mocha';
import assert from 'assert';

import { approveRoleRequest, createRoleRequest, declinedRoleRequest } from '../../src';
import { RoleRequest } from '../../src/modules/discord/services/RoleRequestsService';

describe('Role Requests', function()
{
  this.timeout(20000);

  const discordGuildId = '504135117296500746'; /* Yeonna server Discord ID */
  const requesterDiscordId = '247955535620472844'; /* esfox316#2053 Discord ID */
  let createdRoleRequest: RoleRequest;

  it('should create a role request', async () =>
  {
    const roleRequest = await createRoleRequest({
      discordGuildId,
      requesterDiscordId,
      roleName: 'test role',
      roleColor: '#ffffff',
    });

    createdRoleRequest = roleRequest;

    assert.strictEqual(roleRequest.id !== undefined, true);
  });

  it('should approve a role request', async () =>
  {
    const roleRequest = await approveRoleRequest({
      requestId: createdRoleRequest.id,
      approverDiscordId: requesterDiscordId,
    });

    assert.strictEqual(roleRequest.id !== undefined, true);
  });

  it('should decline a role request', async () =>
  {
    const roleRequest = await declinedRoleRequest({
      requestId: createdRoleRequest.id,
      approverDiscordId: requesterDiscordId,
    });

    assert.strictEqual(roleRequest.id !== undefined, true);
  });
});
