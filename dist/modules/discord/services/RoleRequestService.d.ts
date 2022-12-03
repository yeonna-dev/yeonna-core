import { TimestampedRecord } from '../../../common/DB';
export declare enum RoleRequestField {
    request_id = "request_id",
    requester_discord_id = "requester_discord_id",
    guild_id = "guild_id",
    role_name = "role_name",
    role_color = "role_color",
    notes = "notes",
    status = "status",
    approver_discord_id = "approver_discord_id"
}
export declare enum RoleRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    DECLINED = "DECLINED"
}
export interface RoleRequestRecord extends TimestampedRecord {
    [RoleRequestField.request_id]: string;
    [RoleRequestField.requester_discord_id]: string;
    [RoleRequestField.guild_id]: string;
    [RoleRequestField.role_name]: string;
    [RoleRequestField.role_color]: string;
    [RoleRequestField.notes]: string;
    [RoleRequestField.status]: RoleRequestStatus;
    [RoleRequestField.approver_discord_id]: string;
}
export interface RoleRequest {
    id: string;
    requesterDiscordId: string;
    roleName: string;
    roleColor: string;
    notes: string;
    guildId: string;
    status: RoleRequestStatus;
    approverDiscordId: string;
}
export declare class RoleRequestService {
    static create({ roleName, roleColor, requestNotes, discordGuildId, requesterDiscordId, }: {
        roleName?: string;
        roleColor?: string;
        requestNotes?: string;
        discordGuildId: string;
        requesterDiscordId: string;
    }): Promise<RoleRequest>;
    static approve({ requestId, approverDiscordId, }: {
        requestId: string;
        approverDiscordId?: string;
    }): Promise<RoleRequest | undefined>;
    static decline({ requestId, approverDiscordId, }: {
        requestId: string;
        approverDiscordId?: string;
    }): Promise<RoleRequest | undefined>;
    static updateStatus({ requestId, approverDiscordId, status, }: {
        requestId: string;
        approverDiscordId?: string;
        status: RoleRequestStatus;
    }): Promise<RoleRequest | undefined>;
    static serialize(roleRequest: RoleRequestRecord): RoleRequest;
}
//# sourceMappingURL=RoleRequestService.d.ts.map