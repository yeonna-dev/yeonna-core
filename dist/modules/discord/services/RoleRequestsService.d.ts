export declare enum RoleRequestsFields {
    request_id = "request_id",
    requester_discord_id = "requester_discord_id",
    guild_id = "guild_id",
    role_name = "role_name",
    role_color = "role_color",
    status = "status",
    approver_discord_id = "approver_discord_id",
    created_at = "created_at",
    updated_at = "updated_at",
    deleted_at = "deleted_at"
}
export declare enum RoleRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    DECLINED = "DECLINED"
}
export interface RoleRequestRecord {
    request_id: string;
    requester_discord_id: string;
    guild_id: string;
    role_name: string;
    role_color: string;
    status: RoleRequestStatus;
    approver_discord_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}
export interface RoleRequest {
    id: string;
    requesterDiscordID: string;
    roleName: string;
    roleColor: string;
    guildID: string;
    status: RoleRequestStatus;
    approverDiscordID: string;
}
export declare class RoleRequestsService {
    static create({ roleName, roleColor, discordGuildID, requesterDiscordID, }: {
        roleName?: string;
        roleColor?: string;
        discordGuildID: string;
        requesterDiscordID: string;
    }): Promise<RoleRequest[]>;
    static serialize(roleRequests: RoleRequestRecord[] | null): RoleRequest[];
}
