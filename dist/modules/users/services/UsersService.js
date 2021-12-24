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
exports.UsersService = exports.UsersFields = void 0;
const DB_1 = require("../../../common/DB");
const nanoid_1 = require("../../../common/nanoid");
var UsersFields;
(function (UsersFields) {
    UsersFields["id"] = "id";
    UsersFields["discord_id"] = "discord_id";
    UsersFields["twitch_id"] = "twitch_id";
})(UsersFields = exports.UsersFields || (exports.UsersFields = {}));
;
class UsersService {
    /* Creates a user record. */
    static create({ discordId, twitchId, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!discordId && !twitchId)
                throw new Error('No Discord or Twitch ID provided.');
            const user = {
                [UsersFields.id]: nanoid_1.nanoid(15),
                [UsersFields.discord_id]: discordId,
                [UsersFields.twitch_id]: twitchId,
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
                .or.whereIn(UsersFields.id, ids)
                .or.whereIn(UsersFields.discord_id, ids)
                .or.whereIn(UsersFields.twitch_id, ids);
            if (!data || data.length === 0)
                return [];
            return data.map(user => ({
                id: user[UsersFields.id],
                discordId: user[UsersFields.discord_id],
                twitchId: user[UsersFields.twitch_id],
            }));
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static find({ ids, discordIds, twitchIds, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.users();
            if (ids)
                query.whereIn(UsersFields.id, Array.isArray(ids) ? ids : [ids]);
            if (discordIds)
                query.whereIn(UsersFields.discord_id, Array.isArray(discordIds) ? discordIds : [discordIds]);
            if (twitchIds)
                query.whereIn(UsersFields.twitch_id, Array.isArray(twitchIds) ? twitchIds : [twitchIds]);
            const data = yield query;
            if (!data || data.length === 0)
                return [];
            return data.map(user => ({
                id: user[UsersFields.id],
                discordId: user[UsersFields.discord_id],
                twitchId: user[UsersFields.twitch_id],
            }));
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static updateById(id, { discordId, twitchId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {};
            if (discordId)
                updateData[UsersFields.discord_id] = discordId;
            if (twitchId)
                updateData[UsersFields.twitch_id] = twitchId;
            yield DB_1.DB.users()
                .update(updateData)
                .where(UsersFields.id, id);
        });
    }
}
exports.UsersService = UsersService;
/* Table name is added here to be able to use in joins in other services. */
UsersService.table = 'users';
;
