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
exports.ItemsService = exports.ItemsFields = void 0;
const DB_1 = require("../../../common/DB");
var ItemsFields;
(function (ItemsFields) {
    ItemsFields["category_id"] = "category_id";
    ItemsFields["code"] = "code";
    ItemsFields["name"] = "name";
    ItemsFields["chance_min"] = "chance_min";
    ItemsFields["chance_max"] = "chance_max";
    ItemsFields["price"] = "price";
    ItemsFields["image"] = "image";
    ItemsFields["emote"] = "emote";
    ItemsFields["created_at"] = "created_at";
    ItemsFields["updated_at"] = "updated_at";
    ItemsFields["deleted_at"] = "deleted_at";
})(ItemsFields = exports.ItemsFields || (exports.ItemsFields = {}));
;
exports.ItemsService = new class {
    find({ code, chance, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.items();
            if (code)
                query.where(ItemsFields.code, code);
            if (chance)
                query
                    .and.where(ItemsFields.chance_min, '<', chance)
                    .and.where(ItemsFields.chance_max, '>', chance);
            const data = yield query;
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    findRandom({ code, chance, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.items();
            if (code)
                query.where(ItemsFields.code, code);
            if (chance)
                query
                    .and.where(ItemsFields.chance_min, '<', chance)
                    .and.where(ItemsFields.chance_max, '>', chance);
            const data = yield query
                .orderByRaw('RANDOM()')
                .limit(1);
            return this.serialize(data).pop();
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    findByCodes(codes) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DB_1.DB.items()
                .whereIn(ItemsFields.code, codes);
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    serialize(items) {
        if (!items)
            return [];
        return items.map(({ category_id, code, name, chance_min, chance_max, price, image, emote }) => ({
            categoryID: category_id,
            code,
            name,
            chanceMin: chance_min,
            chanceMax: chance_max,
            price,
            image,
            emote,
        }));
    }
};
