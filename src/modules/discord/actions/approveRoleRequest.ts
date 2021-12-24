import { RoleRequestsService } from '../services/RoleRequestsService';

export async function approveRoleRequest({
  requestId,
  approverDiscordId,
}: {
  requestId: string,
  approverDiscordId?: string,
})
{
  if(!requestId)
    throw new Error('No role request ID provided');

  return RoleRequestsService.approve({ requestId, approverDiscordId });
}
