export declare function createRoleRequest({ roleName, roleColor, discordGuildID, requesterDiscordID, }: {
    roleName?: string;
    roleColor?: string;
    discordGuildID: string;
    requesterDiscordID: string;
}): Promise<import("../services/RoleRequestsService").RoleRequest[]>;
