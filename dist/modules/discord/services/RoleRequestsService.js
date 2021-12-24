"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRequestsService = exports.RoleRequestStatus = exports.RoleRequestsFields = void 0;
const DB_1 = require("../../../common/DB");
const nanoid_1 = require("../../../common/nanoid");
var RoleRequestsFields;
(function (RoleRequestsFields) {
    RoleRequestsFields["request_id"] = "request_id";
    RoleRequestsFields["requester_discord_id"] = "requester_discord_id";
    RoleRequestsFields["guild_id"] = "guild_id";
    RoleRequestsFields["role_name"] = "role_name";
    RoleRequestsFields["role_color"] = "role_color";
    RoleRequestsFields["status"] = "status";
    RoleRequestsFields["approver_discord_id"] = "approver_discord_id";
    RoleRequestsFields["created_at"] = "created_at";
    RoleRequestsFields["updated_at"] = "updated_at";
    RoleRequestsFields["deleted_at"] = "deleted_at";
})(RoleRequestsFields = exports.RoleRequestsFields || (exports.RoleRequestsFields = {}));
;
var RoleRequestStatus;
(function (RoleRequestStatus) {
    RoleRequestStatus["PENDING"] = "PENDING";
    RoleRequestStatus["APPROVED"] = "APPROVED";
    RoleRequestStatus["DECLINED"] = "DECLINED";
})(RoleRequestStatus = exports.RoleRequestStatus || (exports.RoleRequestStatus = {}));
class RoleRequestsService {
    static create({ roleName, roleColor, discordGuildID, requesterDiscordID, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const roleRequestRecord = yield DB_1.DB.discordRoleRequests()
                .insert({
                [RoleRequestsFields.request_id]: nanoid_1.nanoid(15),
                [RoleRequestsFields.requester_discord_id]: requesterDiscordID,
                [RoleRequestsFields.role_name]: roleName,
                [RoleRequestsFields.role_color]: roleColor,
                [RoleRequestsFields.guild_id]: discordGuildID,
            })
                .returning('*');
            return RoleRequestsService.serialize(roleRequestRecord);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(roleRequests) {
        return (roleRequests || []).map(roleRequest => ({
            id: roleRequest[RoleRequestsFields.request_id],
            requesterDiscordID: roleRequest[RoleRequestsFields.requester_discord_id],
            roleName: roleRequest[RoleRequestsFields.role_name],
            roleColor: roleRequest[RoleRequestsFields.role_color],
            guildID: roleRequest[RoleRequestsFields.guild_id],
            status: roleRequest[RoleRequestsFields.status],
            approverDiscordID: roleRequest[RoleRequestsFields.approver_discord_id],
        }));
    }
}
exports.RoleRequestsService = RoleRequestsService;
;
