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
exports.UserService = exports.UserField = void 0;
const DB_1 = require("../../../common/DB");
const nanoid_1 = require("../../../common/nanoid");
var UserField;
(function (UserField) {
    UserField["id"] = "id";
    UserField["discord_id"] = "discord_id";
    UserField["twitch_id"] = "twitch_id";
})(UserField = exports.UserField || (exports.UserField = {}));
;
class UserService {
    /* Creates a user record. */
    static create({ discordId, twitchId, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!discordId && !twitchId)
                throw new Error('No Discord or Twitch ID provided.');
            const user = {
                [UserField.id]: nanoid_1.nanoid(15),
                [UserField.discord_id]: discordId,
                [UserField.twitch_id]: twitchId,
            };
            const data = yield DB_1.DB.users().insert(user).returning('*');
            const createdUser = data === null || data === void 0 ? void 0 : data.pop();
            if (!createdUser)
                throw new Error('User not created');
            return createdUser.id;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static findById(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = Array.isArray(ids) ? ids : [ids];
            const data = yield DB_1.DB.users()
                .or.whereIn(UserField.id, ids)
                .or.whereIn(UserField.discord_id, ids)
                .or.whereIn(UserField.twitch_id, ids);
            if (!data || data.length === 0)
                return [];
            return data.map(user => ({
                id: user[UserField.id],
                discordId: user[UserField.discord_id],
                twitchId: user[UserField.twitch_id],
            }));
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static find({ ids, discordIds, twitchIds, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.users();
            if (ids)
                query.whereIn(UserField.id, Array.isArray(ids) ? ids : [ids]);
            if (discordIds)
                query.whereIn(UserField.discord_id, Array.isArray(discordIds) ? discordIds : [discordIds]);
            if (twitchIds)
                query.whereIn(UserField.twitch_id, Array.isArray(twitchIds) ? twitchIds : [twitchIds]);
            const data = yield query;
            if (!data || data.length === 0)
                return [];
            return data.map(user => ({
                id: user[UserField.id],
                discordId: user[UserField.discord_id],
                twitchId: user[UserField.twitch_id],
            }));
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static updateById(id, { discordId, twitchId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {};
            if (discordId)
                updateData[UserField.discord_id] = discordId;
            if (twitchId)
                updateData[UserField.twitch_id] = twitchId;
            yield DB_1.DB.users()
                .update(updateData)
                .where(UserField.id, id);
        });
    }
}
exports.UserService = UserService;
/* Table name is added here to be able to use in joins in other services. */
UserService.table = 'users';
;
