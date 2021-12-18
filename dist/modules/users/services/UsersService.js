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
    UsersFields["created_at"] = "created_at";
    UsersFields["updated_at"] = "updated_at";
    UsersFields["deleted_at"] = "deleted_at";
})(UsersFields = exports.UsersFields || (exports.UsersFields = {}));
;
exports.UsersService = new class {
    /* Creates a user record. */
    create({ discordID, twitchID, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!discordID && !twitchID)
                throw new Error('No Discord or Twitch ID provided.');
            const user = {
                [UsersFields.id]: nanoid_1.nanoid(15),
                [UsersFields.discord_id]: discordID,
                [UsersFields.twitch_id]: twitchID,
            };
            const data = yield DB_1.DB.users().insert(user).returning('*');
            const createdUser = data === null || data === void 0 ? void 0 : data.pop();
            if (!createdUser)
                throw new Error('User not created');
            return createdUser.id;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    findByID(ids) {
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
                discordID: user[UsersFields.discord_id],
                twitchID: user[UsersFields.twitch_id],
            }));
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    find({ ids, discordIDs, twitchIDs, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.users();
            if (ids)
                query.whereIn(UsersFields.id, Array.isArray(ids) ? ids : [ids]);
            if (discordIDs)
                query.whereIn(UsersFields.discord_id, Array.isArray(discordIDs) ? discordIDs : [discordIDs]);
            if (twitchIDs)
                query.whereIn(UsersFields.twitch_id, Array.isArray(twitchIDs) ? twitchIDs : [twitchIDs]);
            const data = yield query;
            if (!data || data.length === 0)
                return [];
            return data.map(user => ({
                id: user[UsersFields.id],
                discordID: user[UsersFields.discord_id],
                twitchID: user[UsersFields.twitch_id],
            }));
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    updateByID(id, { discordID, twitchID }) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {};
            if (discordID)
                updateData[UsersFields.discord_id] = discordID;
            if (twitchID)
                updateData[UsersFields.twitch_id] = twitchID;
            yield DB_1.DB.users()
                .update(updateData)
                .where(UsersFields.id, id);
        });
    }
};
