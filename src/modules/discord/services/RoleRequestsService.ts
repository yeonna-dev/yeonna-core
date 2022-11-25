import { DB, TimestampedRecord } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum RoleRequestsFields
{
  request_id = 'request_id',
  requester_discord_id = 'requester_discord_id',
  guild_id = 'guild_id',
  role_name = 'role_name',
  role_color = 'role_color',
  notes = 'notes',
  status = 'status',
  approver_discord_id = 'approver_discord_id',
};

export enum RoleRequestStatus
{
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

export interface RoleRequestRecord extends TimestampedRecord
{
  [RoleRequestsFields.request_id]: string;
  [RoleRequestsFields.requester_discord_id]: string;
  [RoleRequestsFields.guild_id]: string;
  [RoleRequestsFields.role_name]: string;
  [RoleRequestsFields.role_color]: string;
  [RoleRequestsFields.notes]: string;
  [RoleRequestsFields.status]: RoleRequestStatus;
  [RoleRequestsFields.approver_discord_id]: string;
}

export interface RoleRequest
{
  id: string;
  requesterDiscordId: string;
  roleName: string;
  roleColor: string;
  notes: string;
  guildId: string;
  status: RoleRequestStatus;
  approverDiscordId: string;
}

export class RoleRequestsService
{
  static async create({
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
    const [roleRequestRecord] = await DB.discordRoleRequests()
      .insert({
        [RoleRequestsFields.request_id]: nanoid(15),
        [RoleRequestsFields.requester_discord_id]: requesterDiscordId,
        [RoleRequestsFields.role_name]: roleName,
        [RoleRequestsFields.role_color]: roleColor,
        [RoleRequestsFields.notes]: requestNotes,
        [RoleRequestsFields.guild_id]: discordGuildId,
      })
      .returning('*');

    return RoleRequestsService.serialize(roleRequestRecord);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async approve({
    requestId,
    approverDiscordId,
  }: {
    requestId: string,
    approverDiscordId?: string,
  })
  {
    return RoleRequestsService.updateStatus({
      requestId,
      approverDiscordId,
      status: RoleRequestStatus.APPROVED,
    });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async decline({
    requestId,
    approverDiscordId,
  }: {
    requestId: string,
    approverDiscordId?: string,
  })
  {
    return RoleRequestsService.updateStatus({
      requestId,
      approverDiscordId,
      status: RoleRequestStatus.DECLINED,
    });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async updateStatus({
    requestId,
    approverDiscordId,
    status,
  }: {
    requestId: string,
    approverDiscordId?: string,
    status: RoleRequestStatus,
  })
  {
    const [updatedData] = await DB.discordRoleRequests()
      .update({
        [RoleRequestsFields.status]: status,
        [RoleRequestsFields.approver_discord_id]: approverDiscordId,
      })
      .where({
        [RoleRequestsFields.request_id]: requestId,
        [RoleRequestsFields.status]: RoleRequestStatus.PENDING,
      })
      .returning('*');

    if(!updatedData)
      return;

    return RoleRequestsService.serialize(updatedData);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(roleRequest: RoleRequestRecord): RoleRequest
  {
    return {
      id: roleRequest[RoleRequestsFields.request_id],
      requesterDiscordId: roleRequest[RoleRequestsFields.requester_discord_id],
      roleName: roleRequest[RoleRequestsFields.role_name],
      roleColor: roleRequest[RoleRequestsFields.role_color],
      notes: roleRequest[RoleRequestsFields.notes],
      guildId: roleRequest[RoleRequestsFields.guild_id],
      status: roleRequest[RoleRequestsFields.status],
      approverDiscordId: roleRequest[RoleRequestsFields.approver_discord_id],
    };
  }
};
