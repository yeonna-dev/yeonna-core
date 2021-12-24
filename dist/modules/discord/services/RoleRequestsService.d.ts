import { TimestampedRecord } from '../../../common/DB';
export declare enum RoleRequestsFields {
    request_id = "request_id",
    requester_discord_id = "requester_discord_id",
    guild_id = "guild_id",
    role_name = "role_name",
    role_color = "role_color",
    status = "status",
    approver_discord_id = "approver_discord_id"
}
export declare enum RoleRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    DECLINED = "DECLINED"
}
export interface RoleRequestRecord extends TimestampedRecord {
    [RoleRequestsFields.request_id]: string;
    [RoleRequestsFields.requester_discord_id]: string;
    [RoleRequestsFields.guild_id]: string;
    [RoleRequestsFields.role_name]: string;
    [RoleRequestsFields.role_color]: string;
    [RoleRequestsFields.status]: RoleRequestStatus;
    [RoleRequestsFields.approver_discord_id]: string;
}
export interface RoleRequest {
    id: string;
    requesterDiscordId: string;
    roleName: string;
    roleColor: string;
    guildId: string;
    status: RoleRequestStatus;
    approverDiscordId: string;
}
export declare class RoleRequestsService {
    static create({ roleName, roleColor, discordGuildId, requesterDiscordId, }: {
        roleName?: string;
        roleColor?: string;
        discordGuildId: string;
        requesterDiscordId: string;
    }): Promise<RoleRequest>;
    static approve({ requestId, approverDiscordId, }: {
        requestId: string;
        approverDiscordId?: string;
    }): Promise<RoleRequest>;
    static decline({ requestId, approverDiscordId, }: {
        requestId: string;
        approverDiscordId?: string;
    }): Promise<RoleRequest>;
    static updateStatus({ requestId, approverDiscordId, status, }: {
        requestId: string;
        approverDiscordId?: string;
        status: RoleRequestStatus;
    }): Promise<RoleRequest>;
    static serialize(roleRequest: RoleRequestRecord): RoleRequest;
}
