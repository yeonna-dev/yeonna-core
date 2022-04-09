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
exports.InventoriesService = exports.InventoriesFields = void 0;
const DB_1 = require("../../../common/DB");
const ItemsService_1 = require("./ItemsService");
var InventoriesFields;
(function (InventoriesFields) {
    InventoriesFields["user_id"] = "user_id";
    InventoriesFields["item_code"] = "item_code";
    InventoriesFields["user_id_item_code"] = "user_id_item_code";
    InventoriesFields["amount"] = "amount";
    InventoriesFields["context"] = "context";
})(InventoriesFields = exports.InventoriesFields || (exports.InventoriesFields = {}));
;
const createUserIdItemCodeKey = (userId, itemCode) => `${userId}:${itemCode}`;
class InventoriesService {
    static getUserItems(userId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.inventories()
                .join(ItemsService_1.ItemsService.table, InventoriesFields.item_code, ItemsService_1.ItemsFields.code)
                .where(InventoriesFields.user_id, userId);
            if (context)
                query.and.where(`${InventoriesService.table}.${InventoriesFields.context}`, context);
            const data = yield query;
            return data.map(InventoriesService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static updateOrCreateUserItems({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const upsertData = [];
            for (const { code, amount } of items) {
                if (amount === 0)
                    continue;
                upsertData.push({
                    [InventoriesFields.user_id]: userId,
                    [InventoriesFields.item_code]: code,
                    [InventoriesFields.user_id_item_code]: createUserIdItemCodeKey(userId, code),
                    [InventoriesFields.amount]: amount || 1,
                    [InventoriesFields.context]: context,
                });
            }
            const data = yield DB_1.DB.inventories()
                .insert(upsertData)
                .returning('*')
                .onConflict(InventoriesFields.user_id_item_code)
                .merge([InventoriesFields.amount]);
            return data.map(InventoriesService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static addUserItems({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedItems = yield InventoriesService.updateUserItemAmounts({
                userId,
                items: items.map(({ code, amount }) => ({ code, addAmount: amount || 1 })),
                context,
            });
            /* If the number of updated items is equal to the given items,
              it means that there are no new items to be added. */
            if (updatedItems.length === items.length)
                return updatedItems;
            return InventoriesService.updateOrCreateUserItems({
                userId,
                items,
                context,
            });
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static removeUserItem({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return InventoriesService.updateUserItemAmounts({
                userId,
                items: items.map(({ code, amount }) => ({ code, subtractAmount: amount })),
                context,
            });
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static updateUserItemAmounts({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let whenClauses = [];
            const userIdItemCodeKeys = [];
            for (const { code, amount, addAmount, subtractAmount } of items) {
                if (addAmount === 0 || subtractAmount === 0)
                    continue;
                const userIdItemCode = createUserIdItemCodeKey(userId, code);
                userIdItemCodeKeys.push(userIdItemCode);
                const whenUserIdItemCodeClause = `WHEN (${InventoriesFields.user_id_item_code} = '${userIdItemCode}')`;
                if (addAmount)
                    whenClauses.push(`
          ${whenUserIdItemCodeClause}
          THEN ${InventoriesFields.amount} + ${addAmount}
        `);
                else if (subtractAmount)
                    whenClauses.push(`
          ${whenUserIdItemCodeClause}
          AND (${InventoriesFields.amount} >= ${subtractAmount})
          THEN ${InventoriesFields.amount} - ${subtractAmount}
        `);
                else
                    whenClauses.push(`${whenUserIdItemCodeClause} THEN ${amount}`);
            }
            if (whenClauses.length === 0)
                return [];
            const updateQuery = `(CASE ${whenClauses.join(' ')} ELSE 0 END)`;
            const query = DB_1.DB.inventories()
                .update({ [InventoriesFields.amount]: DB_1.DB.knex.raw(updateQuery) })
                .whereIn(InventoriesFields.user_id_item_code, userIdItemCodeKeys)
                .returning('*');
            if (context)
                query.and.where({ [InventoriesFields.context]: context });
            const data = yield query;
            const updatedItemsIndices = data.map(record => record[InventoriesFields.user_id_item_code]);
            yield DB_1.DB.inventories()
                .delete()
                .where({ [InventoriesFields.amount]: 0 })
                .and.whereIn(InventoriesFields.user_id_item_code, updatedItemsIndices);
            return data.map(InventoriesService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(userItem) {
        const serialized = {
            amount: userItem[InventoriesFields.amount],
            context: userItem[InventoriesFields.context],
            code: userItem[InventoriesFields.item_code],
        };
        const itemFieldsMapping = {
            [ItemsService_1.ItemsFields.code]: 'code',
            [ItemsService_1.ItemsFields.name]: 'name',
            [ItemsService_1.ItemsFields.chance_min]: 'chanceMin',
            [ItemsService_1.ItemsFields.chance_max]: 'chanceMax',
            [ItemsService_1.ItemsFields.price]: 'price',
            [ItemsService_1.ItemsFields.image]: 'image',
            [ItemsService_1.ItemsFields.emote]: 'emote',
            [ItemsService_1.ItemsFields.category_id]: 'categoryId',
        };
        for (const field in itemFieldsMapping) {
            const serializedKey = itemFieldsMapping[field];
            const property = userItem[field];
            if (property)
                serialized[serializedKey] = property;
        }
        return serialized;
    }
}
exports.InventoriesService = InventoriesService;
InventoriesService.table = 'inventories';
;
