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
exports.TagService = exports.TagField = void 0;
const DB_1 = require("../../../common/DB");
const nanoid_1 = require("../../../common/nanoid");
var TagField;
(function (TagField) {
    TagField["id"] = "id";
    TagField["name"] = "name";
})(TagField = exports.TagField || (exports.TagField = {}));
;
class TagService {
    static find({ ids, search, names, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.tags();
            if (ids) {
                const idsArray = Array.isArray(ids) ? ids : [ids];
                query.whereIn(TagField.id, idsArray);
            }
            if (search)
                query.and.where(TagField.name, 'LIKE', `%${search}%`);
            if (names)
                query.and.whereIn(TagField.name, names);
            const data = yield query;
            return data.map(TagService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static create(names) {
        return __awaiter(this, void 0, void 0, function* () {
            names = Array.isArray(names) ? names : [names];
            if (!names || names.length === 0)
                throw new Error('No name/s provided');
            const tagsData = names.map(name => ({
                [TagField.id]: nanoid_1.nanoid(15),
                [TagField.name]: name,
            }));
            const data = yield DB_1.DB.tags()
                .insert(tagsData)
                .returning('*');
            return data.map(TagService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static remove(names) {
        return __awaiter(this, void 0, void 0, function* () {
            names = Array.isArray(names) ? names : [names];
            if (!names || names.length === 0)
                throw new Error('No name/s provided');
            const data = yield DB_1.DB.tags()
                .delete()
                .whereIn(TagField.name, names)
                .returning('*');
            return data.map(TagService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(tagRecord) {
        return {
            id: tagRecord[TagField.id],
            name: tagRecord[TagField.name],
        };
    }
}
exports.TagService = TagService;
TagService.tableName = 'tags';
;
