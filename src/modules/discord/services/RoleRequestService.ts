import { DB, TimestampedRecord } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum RoleRequestField
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
  [RoleRequestField.request_id]: string;
  [RoleRequestField.requester_discord_id]: string;
  [RoleRequestField.guild_id]: string;
  [RoleRequestField.role_name]: string;
  [RoleRequestField.role_color]: string;
  [RoleRequestField.notes]: string;
  [RoleRequestField.status]: RoleRequestStatus;
  [RoleRequestField.approver_discord_id]: string;
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

export class RoleRequestService
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
        [RoleRequestField.request_id]: nanoid(15),
        [RoleRequestField.requester_discord_id]: requesterDiscordId,
        [RoleRequestField.role_name]: roleName,
        [RoleRequestField.role_color]: roleColor,
        [RoleRequestField.notes]: requestNotes,
        [RoleRequestField.guild_id]: discordGuildId,
      })
      .returning('*');

    return RoleRequestService.serialize(roleRequestRecord);
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
    return RoleRequestService.updateStatus({
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
    return RoleRequestService.updateStatus({
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
        [RoleRequestField.status]: status,
        [RoleRequestField.approver_discord_id]: approverDiscordId,
      })
      .where({
        [RoleRequestField.request_id]: requestId,
        [RoleRequestField.status]: RoleRequestStatus.PENDING,
      })
      .returning('*');

    if(!updatedData)
      return;

    return RoleRequestService.serialize(updatedData);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(roleRequest: RoleRequestRecord): RoleRequest
  {
    return {
      id: roleRequest[RoleRequestField.request_id],
      requesterDiscordId: roleRequest[RoleRequestField.requester_discord_id],
      roleName: roleRequest[RoleRequestField.role_name],
      roleColor: roleRequest[RoleRequestField.role_color],
      notes: roleRequest[RoleRequestField.notes],
      guildId: roleRequest[RoleRequestField.guild_id],
      status: roleRequest[RoleRequestField.status],
      approverDiscordId: roleRequest[RoleRequestField.approver_discord_id],
    };
  }
};
