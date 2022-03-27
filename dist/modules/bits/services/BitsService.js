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
exports.BitsService = exports.BitsFields = void 0;
const DB_1 = require("../../../common/DB");
const nanoid_1 = require("../../../common/nanoid");
var BitsFields;
(function (BitsFields) {
    BitsFields["id"] = "id";
    BitsFields["content"] = "content";
})(BitsFields = exports.BitsFields || (exports.BitsFields = {}));
;
class BitsService {
    static find({ ids, search, content, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.bits();
            if (ids) {
                const idsArray = Array.isArray(ids) ? ids : [ids];
                query.whereIn(BitsFields.id, idsArray);
            }
            if (search)
                query.and.where(BitsFields.content, 'LIKE', `%${search}%`);
            if (content)
                query.and.where(BitsFields.content, content);
            const data = yield query;
            return data.map(BitsService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static create(content) {
        return __awaiter(this, void 0, void 0, function* () {
            content = Array.isArray(content) ? content : [content];
            if (!content || content.length === 0)
                throw new Error('No content provided');
            const bitsData = content.map(content => ({
                [BitsFields.id]: nanoid_1.nanoid(15),
                [BitsFields.content]: content,
            }));
            const data = yield DB_1.DB.bits()
                .insert(bitsData)
                .returning('*');
            return data.map(BitsService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(bitRecord) {
        return {
            id: bitRecord[BitsFields.id],
            content: bitRecord[BitsFields.content],
        };
    }
}
exports.BitsService = BitsService;
/* Table name is added here to be able to use in joins in other services. */
BitsService.table = 'bits';
;
