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
exports.ItemService = exports.ItemField = void 0;
const DB_1 = require("../../../common/DB");
var ItemField;
(function (ItemField) {
    ItemField["code"] = "code";
    ItemField["name"] = "name";
    ItemField["chance_min"] = "chance_min";
    ItemField["chance_max"] = "chance_max";
    ItemField["price"] = "price";
    ItemField["image"] = "image";
    ItemField["emote"] = "emote";
    ItemField["context"] = "context";
    ItemField["category_id"] = "category_id";
})(ItemField = exports.ItemField || (exports.ItemField = {}));
;
class ItemService {
    static find({ code, chance, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.items();
            if (code)
                query.where(ItemField.code, code);
            if (chance)
                query
                    .and.where(ItemField.chance_min, '<', chance)
                    .and.where(ItemField.chance_max, '>', chance);
            const data = yield query;
            return data.map(ItemService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static findRandom(chance, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.items()
                .and.where(ItemField.chance_min, '<', chance)
                .and.where(ItemField.chance_max, '>', chance);
            if (context)
                query.and.where(ItemField.context, context);
            const [data] = yield query
                .orderByRaw('RANDOM()')
                .limit(1);
            if (!data)
                return;
            return ItemService.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static findByCodes(codes) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DB_1.DB.items()
                .whereIn(ItemField.code, codes);
            return data.map(ItemService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(item) {
        return {
            code: item[ItemField.code],
            name: item[ItemField.name],
            chanceMin: item[ItemField.chance_min],
            chanceMax: item[ItemField.chance_max],
            price: item[ItemField.price],
            image: item[ItemField.image],
            emote: item[ItemField.emote],
            categoryId: item[ItemField.category_id],
        };
    }
}
exports.ItemService = ItemService;
/* Table name is added here to be able to use in joins in other services. */
ItemService.table = 'items';
;
