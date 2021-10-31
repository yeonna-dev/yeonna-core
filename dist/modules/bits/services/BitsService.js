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
const supabase_client_1 = require("../../../common/supabase-client");
const nanoid_1 = require("../../../common/nanoid");
const bits = () => supabase_client_1.supabase.from('bits');
var BitsFields;
(function (BitsFields) {
    BitsFields["id"] = "id";
    BitsFields["content"] = "content";
})(BitsFields = exports.BitsFields || (exports.BitsFields = {}));
;
exports.BitsService = new class {
    constructor() {
        this.tableName = 'bits';
    }
    find({ ids, search, content, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const idsArray = Array.isArray(ids) ? ids : [ids];
            const query = bits()
                .select();
            if (ids)
                query.in(BitsFields.id, idsArray);
            if (search)
                query.like(BitsFields.content, `%${search}%`);
            if (content)
                query.eq(BitsFields.content, content);
            const { data, error } = yield query;
            if (error)
                throw error;
            return data || [];
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    create(content) {
        return __awaiter(this, void 0, void 0, function* () {
            content = Array.isArray(content) ? content : [content];
            if (!content || content.length === 0)
                throw new Error('No content provided');
            const bitsData = content.map(content => ({
                [BitsFields.id]: nanoid_1.nanoid(15),
                [BitsFields.content]: content,
            }));
            const { data, error } = yield bits().insert(bitsData);
            if (error)
                throw error;
            return data ? data.map(bit => bit[BitsFields.id]) : [];
        });
    }
};
