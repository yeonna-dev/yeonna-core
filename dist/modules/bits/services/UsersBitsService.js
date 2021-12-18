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
const DB_1 = require("../../../common/DB");
const BitsService_1 = require("./BitsService");
var UsersBitsFields;
(function (UsersBitsFields) {
    UsersBitsFields["user_id"] = "user_id";
    UsersBitsFields["bit_id"] = "bit_id";
    UsersBitsFields["tag_ids"] = "tag_ids";
})(UsersBitsFields = exports.UsersBitsFields || (exports.UsersBitsFields = {}));
;
exports.UsersBitsService = new class {
    find({ userIDs, bitIDs, search, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.usersBits()
                .join(BitsService_1.BitsService.table, UsersBitsFields.bit_id, BitsService_1.BitsFields.id);
            if (userIDs)
                query.whereIn(UsersBitsFields.user_id, userIDs);
            if (bitIDs)
                query.and.whereIn(UsersBitsFields.bit_id, bitIDs);
            if (search)
                query.and.where(`${BitsService_1.BitsService.table}.${BitsService_1.BitsFields.content}`, 'LIKE', `%${search}%`);
            const data = yield query;
            if (!data || data.length === 0)
                return [];
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    create(usersBitsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertData = usersBitsData.map(({ userID, bitID, tagIDs }) => {
                const data = {
                    [UsersBitsFields.user_id]: userID,
                    [UsersBitsFields.bit_id]: bitID,
                };
                if (tagIDs && tagIDs.length !== 0)
                    data[UsersBitsFields.tag_ids] = tagIDs.join(',');
                return data;
            });
            const data = yield DB_1.DB.usersBits()
                .insert(insertData)
                .returning('*');
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    remove({ userID, bitID }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DB_1.DB.usersBits()
                .delete()
                .where({ [UsersBitsFields.user_id]: userID, [UsersBitsFields.bit_id]: bitID })
                .returning('*');
            return data.map((deletedUserBit) => ({
                userID: deletedUserBit[UsersBitsFields.user_id],
                bitID: deletedUserBit[UsersBitsFields.bit_id],
            }));
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    addTags({ userID, bitID, tagIDs }) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.usersBits()
                .update({ [UsersBitsFields.tag_ids]: tagIDs.join(',') })
                .where({
                [UsersBitsFields.user_id]: userID,
                [UsersBitsFields.bit_id]: bitID,
            })
                .returning('*');
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    serialize(usersBits) {
        const data = [];
        for (const userBit of usersBits || []) {
            const serialized = { user: { id: userBit[UsersBitsFields.user_id] } };
            serialized.bit = { id: userBit[UsersBitsFields.bit_id] };
            const content = userBit[BitsService_1.BitsFields.content];
            if (content)
                serialized.bit.content = content;
            data.push(serialized);
        }
        return data;
    }
};
