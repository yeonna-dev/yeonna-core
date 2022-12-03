import { NonPendingRoleRequest } from '../../..';
import { RoleRequestService } from '../services/RoleRequestService';

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

  const approved = await RoleRequestService.approve({ requestId, approverDiscordId });
  if(!approved)
    throw new NonPendingRoleRequest();

  return approved;
}
