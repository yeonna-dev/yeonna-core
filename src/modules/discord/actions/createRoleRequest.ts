import { RoleRequestsService } from '../services/RoleRequestsService';

export async function createRoleRequest({
  roleName,
  roleColor,
  discordGuildId,
  requesterDiscordId,
}: {
  roleName?: string,
  roleColor?: string,
  discordGuildId: string,
  requesterDiscordId: string,
})
{
  if(!discordGuildId)
    throw new Error('No Discord Guild ID provided');

  if(!requesterDiscordId)
    throw new Error('No requester Discord ID provided');

  return RoleRequestsService.create({
    roleName,
    roleColor,
    discordGuildId: discordGuildId,
    requesterDiscordId: requesterDiscordId,
  });
}
