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
class UsersBitsService {
    static find({ userIds, bitIds, search, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.usersBits()
                .join(BitsService_1.BitsService.table, UsersBitsFields.bit_id, BitsService_1.BitsFields.id);
            if (userIds)
                query.whereIn(UsersBitsFields.user_id, userIds);
            if (bitIds)
                query.and.whereIn(UsersBitsFields.bit_id, bitIds);
            if (search)
                query.and.where(`${BitsService_1.BitsService.table}.${BitsService_1.BitsFields.content}`, 'LIKE', `%${search}%`);
            const data = yield query;
            if (!data || data.length === 0)
                return [];
            return data.map(UsersBitsService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static create(usersBitsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertData = [];
            for (const { userId, bitId, tagIds } of usersBitsData) {
                const data = {
                    [UsersBitsFields.user_id]: userId,
                    [UsersBitsFields.bit_id]: bitId,
                };
                if (tagIds && tagIds.length !== 0)
                    data[UsersBitsFields.tag_ids] = tagIds.join(',');
                insertData.push(data);
            }
            const data = yield DB_1.DB.usersBits()
                .insert(insertData)
                .returning('*');
            return data.map(UsersBitsService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static remove({ userId, bitId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DB_1.DB.usersBits()
                .delete()
                .where({ [UsersBitsFields.user_id]: userId, [UsersBitsFields.bit_id]: bitId })
                .returning('*');
            return data.map(deletedUserBit => ({
                userId: deletedUserBit[UsersBitsFields.user_id],
                bitId: deletedUserBit[UsersBitsFields.bit_id],
            }));
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static addTags({ userId, bitId, tagIds, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DB_1.DB.usersBits()
                .update({ [UsersBitsFields.tag_ids]: tagIds.join(',') })
                .where({
                [UsersBitsFields.user_id]: userId,
                [UsersBitsFields.bit_id]: bitId,
            })
                .returning('*');
            return data.map(UsersBitsService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(userBitRecord) {
        const serialized = {
            user: { id: userBitRecord[UsersBitsFields.user_id] },
            bit: { id: userBitRecord[UsersBitsFields.bit_id] },
        };
        /* Set the `bit` property of the object if the `content` field has a value. */
        const content = userBitRecord[BitsService_1.BitsFields.content];
        if (content)
            serialized.bit.content = content;
        /* Set the `tags` property of the object if the `tag_ids` field has a value. */
        const tagIds = userBitRecord[UsersBitsFields.tag_ids];
        if (tagIds)
            serialized.tags = tagIds.split(',').map(id => ({ id }));
        return serialized;
    }
}
exports.UsersBitsService = UsersBitsService;
;
