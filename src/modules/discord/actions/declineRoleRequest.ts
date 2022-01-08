import { NonPendingRoleRequest } from '../../..';
import { RoleRequestsService } from '../services/RoleRequestsService';

export async function declineRoleRequest({
  requestId,
  approverDiscordId,
}: {
  requestId: string,
  approverDiscordId?: string,
})
{
  if(!requestId)
    throw new Error('No role request ID provided');

  const declined = await RoleRequestsService.decline({ requestId, approverDiscordId });
  if(!declined)
    throw new NonPendingRoleRequest();

  return declined;
}
