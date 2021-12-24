export declare function declinedRoleRequest({ requestId, approverDiscordId, }: {
    requestId: string;
    approverDiscordId?: string;
}): Promise<import("../services/RoleRequestsService").RoleRequest>;
