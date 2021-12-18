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
exports.TagsService = exports.TagsFields = void 0;
const DB_1 = require("../../../common/DB");
const nanoid_1 = require("../../../common/nanoid");
var TagsFields;
(function (TagsFields) {
    TagsFields["id"] = "id";
    TagsFields["name"] = "name";
})(TagsFields = exports.TagsFields || (exports.TagsFields = {}));
;
exports.TagsService = new class {
    constructor() {
        this.tableName = 'tags';
    }
    find({ ids, search, names, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.tags();
            if (ids) {
                const idsArray = Array.isArray(ids) ? ids : [ids];
                query.whereIn(TagsFields.id, idsArray);
            }
            if (search)
                query.and.where(TagsFields.name, 'LIKE', `%${search}%`);
            if (names)
                query.and.whereIn(TagsFields.name, names);
            const data = yield query;
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    create(names) {
        return __awaiter(this, void 0, void 0, function* () {
            names = Array.isArray(names) ? names : [names];
            if (!names || names.length === 0)
                throw new Error('No name/s provided');
            const tagsData = names.map(name => ({
                [TagsFields.id]: nanoid_1.nanoid(15),
                [TagsFields.name]: name,
            }));
            const data = yield DB_1.DB.tags()
                .insert(tagsData)
                .returning('*');
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    remove(names) {
        return __awaiter(this, void 0, void 0, function* () {
            names = Array.isArray(names) ? names : [names];
            if (!names || names.length === 0)
                throw new Error('No name/s provided');
            const data = yield DB_1.DB.tags()
                .delete()
                .whereIn(TagsFields.name, names)
                .returning('*');
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    serialize(tags) {
        return (tags || []).map(tag => ({
            id: tag[TagsFields.id],
            name: tag[TagsFields.name],
        }));
    }
};
