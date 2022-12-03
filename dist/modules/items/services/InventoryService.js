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
exports.InventoryService = exports.InventoryField = void 0;
const DB_1 = require("../../../common/DB");
const ItemService_1 = require("./ItemService");
var InventoryField;
(function (InventoryField) {
    InventoryField["user_id"] = "user_id";
    InventoryField["item_code"] = "item_code";
    InventoryField["user_id_item_code"] = "user_id_item_code";
    InventoryField["amount"] = "amount";
    InventoryField["context"] = "context";
})(InventoryField = exports.InventoryField || (exports.InventoryField = {}));
;
const categoriesTable = 'categories';
const categoryIdField = 'id';
const categoryNameField = 'name';
const categoryNameAlias = 'category_name';
const createUserIdItemCodeKey = (userId, itemCode) => `${userId}:${itemCode}`;
class InventoryService {
    static getUserItems({ userId, context, category, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.inventories()
                .select(`${InventoryService.table}.*`, `${ItemService_1.ItemService.table}.*`, `${categoriesTable}.${categoryNameField} as ${categoryNameAlias}`)
                .join(ItemService_1.ItemService.table, InventoryField.item_code, ItemService_1.ItemField.code)
                .join(categoriesTable, ItemService_1.ItemField.category_id, `${categoriesTable}.${categoryIdField}`)
                .where(InventoryField.user_id, userId);
            if (context)
                query.and.where(`${InventoryService.table}.${InventoryField.context}`, context);
            if (category)
                query.and.whereILike(`${categoriesTable}.${categoryNameField}`, category.toLowerCase());
            const data = yield query;
            return data.map(InventoryService.serialize);
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
                    [InventoryField.user_id]: userId,
                    [InventoryField.item_code]: code,
                    [InventoryField.user_id_item_code]: createUserIdItemCodeKey(userId, code),
                    [InventoryField.amount]: amount || 1,
                    [InventoryField.context]: context,
                });
            }
            const data = yield DB_1.DB.inventories()
                .insert(upsertData)
                .returning('*')
                .onConflict(InventoryField.user_id_item_code)
                .merge([InventoryField.amount]);
            return data.map(InventoryService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static addUserItems({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedItems = yield InventoryService.updateUserItemAmounts({
                userId,
                items: items.map(({ code, amount }) => ({ code, addAmount: amount || 1 })),
                context,
            });
            /* If the number of updated items is equal to the given items,
              it means that there are no new items to be added. */
            if (updatedItems.length === items.length)
                return updatedItems;
            return InventoryService.updateOrCreateUserItems({
                userId,
                items,
                context,
            });
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static removeUserItem({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return InventoryService.updateUserItemAmounts({
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
                const whenUserIdItemCodeClause = `WHEN (${InventoryField.user_id_item_code} = '${userIdItemCode}')`;
                if (addAmount)
                    whenClauses.push(`
          ${whenUserIdItemCodeClause}
          THEN ${InventoryField.amount} + ${addAmount}
        `);
                else if (subtractAmount)
                    whenClauses.push(`
          ${whenUserIdItemCodeClause}
          AND (${InventoryField.amount} >= ${subtractAmount})
          THEN ${InventoryField.amount} - ${subtractAmount}
        `);
                else
                    whenClauses.push(`${whenUserIdItemCodeClause} THEN ${amount}`);
            }
            if (whenClauses.length === 0)
                return [];
            const updateQuery = `(CASE ${whenClauses.join(' ')} ELSE 0 END)`;
            const query = DB_1.DB.inventories()
                .update({ [InventoryField.amount]: DB_1.DB.knex.raw(updateQuery) })
                .whereIn(InventoryField.user_id_item_code, userIdItemCodeKeys)
                .returning('*');
            if (context)
                query.and.where({ [InventoryField.context]: context });
            const data = yield query;
            const updatedItemsIndices = data.map(record => record[InventoryField.user_id_item_code]);
            yield DB_1.DB.inventories()
                .delete()
                .where({ [InventoryField.amount]: 0 })
                .and.whereIn(InventoryField.user_id_item_code, updatedItemsIndices);
            return data.map(InventoryService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(userItem) {
        const serialized = {
            amount: userItem[InventoryField.amount],
            context: userItem[InventoryField.context],
            code: userItem[InventoryField.item_code],
        };
        const itemFieldsMapping = {
            [ItemService_1.ItemField.code]: 'code',
            [ItemService_1.ItemField.name]: 'name',
            [ItemService_1.ItemField.chance_min]: 'chanceMin',
            [ItemService_1.ItemField.chance_max]: 'chanceMax',
            [ItemService_1.ItemField.price]: 'price',
            [ItemService_1.ItemField.image]: 'image',
            [ItemService_1.ItemField.emote]: 'emote',
            [categoryNameAlias]: 'category'
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
exports.InventoryService = InventoryService;
InventoryService.table = 'inventories';
;
