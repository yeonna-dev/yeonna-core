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
exports.RoleRequestService = exports.RoleRequestStatus = exports.RoleRequestField = void 0;
const DB_1 = require("../../../common/DB");
const nanoid_1 = require("../../../common/nanoid");
var RoleRequestField;
(function (RoleRequestField) {
    RoleRequestField["request_id"] = "request_id";
    RoleRequestField["requester_discord_id"] = "requester_discord_id";
    RoleRequestField["guild_id"] = "guild_id";
    RoleRequestField["role_name"] = "role_name";
    RoleRequestField["role_color"] = "role_color";
    RoleRequestField["notes"] = "notes";
    RoleRequestField["status"] = "status";
    RoleRequestField["approver_discord_id"] = "approver_discord_id";
})(RoleRequestField = exports.RoleRequestField || (exports.RoleRequestField = {}));
;
var RoleRequestStatus;
(function (RoleRequestStatus) {
    RoleRequestStatus["PENDING"] = "PENDING";
    RoleRequestStatus["APPROVED"] = "APPROVED";
    RoleRequestStatus["DECLINED"] = "DECLINED";
})(RoleRequestStatus = exports.RoleRequestStatus || (exports.RoleRequestStatus = {}));
class RoleRequestService {
    static create({ roleName, roleColor, requestNotes, discordGuildId, requesterDiscordId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [roleRequestRecord] = yield DB_1.DB.discordRoleRequests()
                .insert({
                [RoleRequestField.request_id]: nanoid_1.nanoid(15),
                [RoleRequestField.requester_discord_id]: requesterDiscordId,
                [RoleRequestField.role_name]: roleName,
                [RoleRequestField.role_color]: roleColor,
                [RoleRequestField.notes]: requestNotes,
                [RoleRequestField.guild_id]: discordGuildId,
            })
                .returning('*');
            return RoleRequestService.serialize(roleRequestRecord);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static approve({ requestId, approverDiscordId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return RoleRequestService.updateStatus({
                requestId,
                approverDiscordId,
                status: RoleRequestStatus.APPROVED,
            });
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static decline({ requestId, approverDiscordId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return RoleRequestService.updateStatus({
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
                [RoleRequestField.status]: status,
                [RoleRequestField.approver_discord_id]: approverDiscordId,
            })
                .where({
                [RoleRequestField.request_id]: requestId,
                [RoleRequestField.status]: RoleRequestStatus.PENDING,
            })
                .returning('*');
            if (!updatedData)
                return;
            return RoleRequestService.serialize(updatedData);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(roleRequest) {
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
}
exports.RoleRequestService = RoleRequestService;
;
