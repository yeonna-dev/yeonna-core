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
exports.UserBitService = exports.UserBitField = void 0;
const DB_1 = require("../../../common/DB");
const BitService_1 = require("./BitService");
var UserBitField;
(function (UserBitField) {
    UserBitField["user_id"] = "user_id";
    UserBitField["bit_id"] = "bit_id";
    UserBitField["tag_ids"] = "tag_ids";
})(UserBitField = exports.UserBitField || (exports.UserBitField = {}));
;
class UserBitService {
    static find({ userIds, bitIds, search, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.usersBits()
                .join(BitService_1.BitService.table, UserBitField.bit_id, BitService_1.BitField.id);
            if (userIds)
                query.whereIn(UserBitField.user_id, userIds);
            if (bitIds)
                query.and.whereIn(UserBitField.bit_id, bitIds);
            if (search)
                query.and.where(`${BitService_1.BitService.table}.${BitService_1.BitField.content}`, 'LIKE', `%${search}%`);
            const data = yield query;
            if (!data || data.length === 0)
                return [];
            return data.map(UserBitService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static create(usersBitsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertData = [];
            for (const { userId, bitId, tagIds } of usersBitsData) {
                const data = {
                    [UserBitField.user_id]: userId,
                    [UserBitField.bit_id]: bitId,
                };
                if (tagIds && tagIds.length !== 0)
                    data[UserBitField.tag_ids] = tagIds.join(',');
                insertData.push(data);
            }
            const data = yield DB_1.DB.usersBits()
                .insert(insertData)
                .returning('*');
            return data.map(UserBitService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static remove({ userId, bitId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DB_1.DB.usersBits()
                .delete()
                .where({ [UserBitField.user_id]: userId, [UserBitField.bit_id]: bitId })
                .returning('*');
            return data.map(deletedUserBit => ({
                userId: deletedUserBit[UserBitField.user_id],
                bitId: deletedUserBit[UserBitField.bit_id],
            }));
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static addTags({ userId, bitId, tagIds, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DB_1.DB.usersBits()
                .update({ [UserBitField.tag_ids]: tagIds.join(',') })
                .where({
                [UserBitField.user_id]: userId,
                [UserBitField.bit_id]: bitId,
            })
                .returning('*');
            return data.map(UserBitService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(userBitRecord) {
        const serialized = {
            user: { id: userBitRecord[UserBitField.user_id] },
            bit: { id: userBitRecord[UserBitField.bit_id] },
        };
        /* Set the `bit` property of the object if the `content` field has a value. */
        const content = userBitRecord[BitService_1.BitField.content];
        if (content)
            serialized.bit.content = content;
        /* Set the `tags` property of the object if the `tag_ids` field has a value. */
        const tagIds = userBitRecord[UserBitField.tag_ids];
        if (tagIds)
            serialized.tags = tagIds.split(',').map(id => ({ id }));
        return serialized;
    }
}
exports.UserBitService = UserBitService;
;
