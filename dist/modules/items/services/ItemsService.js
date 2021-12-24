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
})(ItemsFields = exports.ItemsFields || (exports.ItemsFields = {}));
;
class ItemsService {
    static find({ code, chance, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.items();
            if (code)
                query.where(ItemsFields.code, code);
            if (chance)
                query
                    .and.where(ItemsFields.chance_min, '<', chance)
                    .and.where(ItemsFields.chance_max, '>', chance);
            const data = yield query;
            return data.map(ItemsService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static findRandom({ code, chance, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.items();
            if (code)
                query.where(ItemsFields.code, code);
            if (chance)
                query
                    .and.where(ItemsFields.chance_min, '<', chance)
                    .and.where(ItemsFields.chance_max, '>', chance);
            const [data] = yield query
                .orderByRaw('RANDOM()')
                .limit(1);
            if (!data)
                return;
            return ItemsService.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static findByCodes(codes) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DB_1.DB.items()
                .whereIn(ItemsFields.code, codes);
            return data.map(ItemsService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(item) {
        return {
            code: item[ItemsFields.code],
            name: item[ItemsFields.name],
            chanceMin: item[ItemsFields.chance_min],
            chanceMax: item[ItemsFields.chance_max],
            price: item[ItemsFields.price],
            image: item[ItemsFields.image],
            emote: item[ItemsFields.emote],
            categoryId: item[ItemsFields.category_id],
        };
    }
}
exports.ItemsService = ItemsService;
/* Table name is added here to be able to use in joins in other services. */
ItemsService.table = 'items';
;
