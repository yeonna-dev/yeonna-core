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
exports.UsersBitsService = exports.UsersBitsFields = void 0;
const supabase_client_1 = require("../../../common/supabase-client");
const BitsService_1 = require("./BitsService");
const usersBits = () => supabase_client_1.supabase.from('users_bits');
var UsersBitsFields;
(function (UsersBitsFields) {
    UsersBitsFields["user_id"] = "user_id";
    UsersBitsFields["bit_id"] = "bit_id";
    UsersBitsFields["bit"] = "bit";
})(UsersBitsFields = exports.UsersBitsFields || (exports.UsersBitsFields = {}));
;
exports.UsersBitsService = new class {
    find({ userIDs, bitIDs, search, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = usersBits()
                .select(`
        ${UsersBitsFields.user_id},
        ${UsersBitsFields.bit_id},
        ${UsersBitsFields.bit}:${BitsService_1.BitsService.tableName} (
          ${BitsService_1.BitsFields.content}
        )
      `);
            if (userIDs)
                query.in(UsersBitsFields.user_id, userIDs);
            if (bitIDs)
                query.in(UsersBitsFields.bit_id, bitIDs);
            if (search)
                query.like(`${UsersBitsFields.bit}.${BitsService_1.BitsFields.content}`, `%${search}%`);
            let { data, error } = yield query;
            if (error)
                throw error;
            if (!data || data.length === 0)
                return [];
            /* Remove duplicate data from result and filter results
              that only have bits if a search query was given. */
            const filtered = [];
            for (const userBit of data) {
                const isUnique = !filtered.some(element => element[UsersBitsFields.bit_id] === userBit[UsersBitsFields.bit_id]);
                if (!isUnique)
                    continue;
                if (search && !userBit[UsersBitsFields.bit])
                    continue;
                filtered.push(userBit);
            }
            return this.serialize(filtered);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    create(usersBitsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertData = usersBitsData.map(({ userID, bitID }) => ({
                [UsersBitsFields.user_id]: userID,
                [UsersBitsFields.bit_id]: bitID,
            }));
            const { data, error } = yield usersBits().insert(insertData);
            if (error)
                throw error;
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    remove({ userID, bitID }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield usersBits()
                .delete({ returning: 'representation' })
                .match({ [UsersBitsFields.user_id]: userID, [UsersBitsFields.bit_id]: bitID });
            if (error)
                throw error;
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    serialize(usersBits) {
        const data = [];
        for (const userBit of (usersBits || [])) {
            const serialized = {
                user: { id: userBit[UsersBitsFields.user_id] },
                bit: { id: userBit[UsersBitsFields.bit_id] },
            };
            const bit = userBit[UsersBitsFields.bit];
            if (bit)
                serialized.bit.content = bit[BitsService_1.BitsFields.content];
            data.push(serialized);
        }
        return data;
    }
};
