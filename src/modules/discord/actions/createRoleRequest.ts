import { RoleRequestService } from '../services/RoleRequestService';

export async function createRoleRequest({
  roleName,
  roleColor,
  requestNotes,
  discordGuildId,
  requesterDiscordId,
}: {
  roleName?: string,
  roleColor?: string,
  requestNotes?: string,
  discordGuildId: string,
  requesterDiscordId: string,
})
{
  if(!discordGuildId)
    throw new Error('No Discord Guild ID provided');

  if(!requesterDiscordId)
    throw new Error('No requester Discord ID provided');

  return RoleRequestService.create({
    roleName,
    roleColor,
    requestNotes,
    discordGuildId: discordGuildId,
    requesterDiscordId: requesterDiscordId,
  });
}
