import { NonPendingRoleRequest } from '../../..';
import { RoleRequestService } from '../services/RoleRequestService';

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

  const declined = await RoleRequestService.decline({ requestId, approverDiscordId });
  if(!declined)
    throw new NonPendingRoleRequest();

  return declined;
}
