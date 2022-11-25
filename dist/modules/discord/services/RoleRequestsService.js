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
    RoleRequestsFields["notes"] = "notes";
    RoleRequestsFields["status"] = "status";
    RoleRequestsFields["approver_discord_id"] = "approver_discord_id";
})(RoleRequestsFields = exports.RoleRequestsFields || (exports.RoleRequestsFields = {}));
;
var RoleRequestStatus;
(function (RoleRequestStatus) {
    RoleRequestStatus["PENDING"] = "PENDING";
    RoleRequestStatus["APPROVED"] = "APPROVED";
    RoleRequestStatus["DECLINED"] = "DECLINED";
})(RoleRequestStatus = exports.RoleRequestStatus || (exports.RoleRequestStatus = {}));
class RoleRequestsService {
    static create({ roleName, roleColor, requestNotes, discordGuildId, requesterDiscordId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [roleRequestRecord] = yield DB_1.DB.discordRoleRequests()
                .insert({
                [RoleRequestsFields.request_id]: nanoid_1.nanoid(15),
                [RoleRequestsFields.requester_discord_id]: requesterDiscordId,
                [RoleRequestsFields.role_name]: roleName,
                [RoleRequestsFields.role_color]: roleColor,
                [RoleRequestsFields.notes]: requestNotes,
                [RoleRequestsFields.guild_id]: discordGuildId,
            })
                .returning('*');
            return RoleRequestsService.serialize(roleRequestRecord);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static approve({ requestId, approverDiscordId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return RoleRequestsService.updateStatus({
                requestId,
                approverDiscordId,
                status: RoleRequestStatus.APPROVED,
            });
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static decline({ requestId, approverDiscordId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return RoleRequestsService.updateStatus({
                requestId,
                approverDiscordId,
                status: RoleRequestStatus.DECLINED,
            });
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static updateStatus({ requestId, approverDiscordId, status, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedData] = yield DB_1.DB.discordRoleRequests()
                .update({
                [RoleRequestsFields.status]: status,
                [RoleRequestsFields.approver_discord_id]: approverDiscordId,
            })
                .where({
                [RoleRequestsFields.request_id]: requestId,
                [RoleRequestsFields.status]: RoleRequestStatus.PENDING,
            })
                .returning('*');
            if (!updatedData)
                return;
            return RoleRequestsService.serialize(updatedData);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(roleRequest) {
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
}
exports.RoleRequestsService = RoleRequestsService;
;
