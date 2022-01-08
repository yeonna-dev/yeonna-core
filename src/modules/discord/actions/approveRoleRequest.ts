import { NonPendingRoleRequest } from '../../..';
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

  const approved = await RoleRequestsService.approve({ requestId, approverDiscordId });
  if(!approved)
    throw new NonPendingRoleRequest();

  return approved;
}
