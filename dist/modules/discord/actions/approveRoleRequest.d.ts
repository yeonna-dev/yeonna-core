export declare function approveRoleRequest({ requestId, approverDiscordId, }: {
    requestId: string;
    approverDiscordId?: string;
}): Promise<import("../services/RoleRequestsService").RoleRequest>;
