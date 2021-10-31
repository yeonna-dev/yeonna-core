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
const supabase_client_1 = require("../../../common/supabase-client");
const nanoid_1 = require("../../../common/nanoid");
const users = () => supabase_client_1.supabase.from('users');
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
            const { data, error } = yield users().insert(user);
            if (error)
                throw error;
            const createdUser = data === null || data === void 0 ? void 0 : data.pop();
            if (!createdUser)
                throw new Error('User not created');
            return createdUser.id;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    findByID(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            ids = `(${(Array.isArray(ids) ? ids : [ids]).join(',')})`;
            const { data, error } = yield users()
                .select()
                .or(`${UsersFields.id}.in.${ids},`
                + `${UsersFields.discord_id}.in.${ids},`
                + `${UsersFields.twitch_id}.in.${ids}`);
            if (error)
                throw error;
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
            const query = users()
                .select();
            if (ids)
                query.in(UsersFields.id, Array.isArray(ids) ? ids : [ids]);
            if (discordIDs)
                query.in(UsersFields.discord_id, Array.isArray(discordIDs) ? discordIDs : [discordIDs]);
            if (twitchIDs)
                query.in(UsersFields.twitch_id, Array.isArray(twitchIDs) ? twitchIDs : [twitchIDs]);
            const { data, error } = yield query;
            if (error)
                throw error;
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
            const { error } = yield users()
                .update(updateData)
                .match({ [UsersFields.id]: id });
            if (error)
                throw error;
        });
    }
};
