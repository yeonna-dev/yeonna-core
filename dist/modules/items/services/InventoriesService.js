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
    InventoriesFields["pk_id"] = "pk_id";
    InventoriesFields["user_id"] = "user_id";
    InventoriesFields["item_code"] = "item_code";
    InventoriesFields["user_id_item_code"] = "user_id_item_code";
    InventoriesFields["amount"] = "amount";
    InventoriesFields["context"] = "context";
    InventoriesFields["created_at"] = "created_at";
    InventoriesFields["updated_at"] = "updated_at";
    InventoriesFields["deleted_at"] = "deleted_at";
})(InventoriesFields = exports.InventoriesFields || (exports.InventoriesFields = {}));
;
const createUserIdItemCodeKey = (userId, itemCode) => `${userId}:${itemCode}`;
exports.InventoriesService = new class {
    getUserItems(userId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.inventories()
                .join(ItemsService_1.ItemsService.table, InventoriesFields.item_code, ItemsService_1.ItemsFields.code)
                .where(InventoriesFields.user_id, userId);
            if (context)
                query.and.where(InventoriesFields.context, context);
            const data = yield query;
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    updateOrCreateUserItems({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const upsertData = [];
            for (const { code, amount } of items) {
                if (amount === 0)
                    continue;
                upsertData.push({
                    [InventoriesFields.user_id]: userId,
                    [InventoriesFields.item_code]: code,
                    [InventoriesFields.user_id_item_code]: createUserIdItemCodeKey(userId, code),
                    [InventoriesFields.amount]: amount,
                    [InventoriesFields.context]: context,
                });
            }
            const data = yield DB_1.DB.inventories()
                .insert(upsertData)
                .returning('*')
                .onConflict(InventoriesFields.user_id_item_code)
                .merge([InventoriesFields.amount]);
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    addUserItems({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedItems = yield this.updateUserItemAmounts({
                userId,
                items: items.map(({ code, amount }) => ({ code, addAmount: amount })),
                context,
            });
            /* If the number of updated items is equal to the given items,
              it means that there are no new items to be added. */
            if (updatedItems.length === items.length)
                return updatedItems;
            return this.updateOrCreateUserItems({
                userId,
                items,
                context,
            });
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    removeUserItem({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateUserItemAmounts({
                userId,
                items: items.map(({ code, amount }) => ({ code, subtractAmount: amount })),
                context,
            });
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    updateUserItemAmounts({ userId, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let whenClauses = [];
            const userIdItemCodeKeys = [];
            for (const { code, addAmount, subtractAmount } of items) {
                if (addAmount === 0 || subtractAmount === 0)
                    continue;
                const userIdItemCode = createUserIdItemCodeKey(userId, code);
                userIdItemCodeKeys.push(userIdItemCode);
                if (subtractAmount)
                    whenClauses.push(`
          WHEN (${InventoriesFields.user_id_item_code} = '${userIdItemCode}')
          AND (${InventoriesFields.amount} >= ${subtractAmount})
          THEN ${InventoriesFields.amount} - ${subtractAmount}
        `);
                else
                    whenClauses.push(`
          WHEN ${InventoriesFields.user_id_item_code} = '${userIdItemCode}'
          THEN ${InventoriesFields.amount} + ${addAmount}
        `);
            }
            if (whenClauses.length === 0)
                return [];
            const updateQuery = `(CASE ${whenClauses.join(' ')} ELSE 0 END)`;
            const data = yield DB_1.DB.inventories()
                .update({ [InventoriesFields.amount]: DB_1.DB.knex.raw(updateQuery) })
                .whereIn(InventoriesFields.user_id_item_code, userIdItemCodeKeys)
                .returning('*');
            return this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    serialize(userItems) {
        const itemFieldsMapping = {
            [ItemsService_1.ItemsFields.code]: 'code',
            [ItemsService_1.ItemsFields.name]: 'name',
            [ItemsService_1.ItemsFields.chance_min]: 'chanceMin',
            [ItemsService_1.ItemsFields.chance_max]: 'chanceMax',
            [ItemsService_1.ItemsFields.price]: 'price',
            [ItemsService_1.ItemsFields.image]: 'image',
            [ItemsService_1.ItemsFields.emote]: 'emote',
            [ItemsService_1.ItemsFields.category_id]: 'categoryID',
        };
        const data = [];
        for (const userItem of userItems || []) {
            const serialized = {
                amount: userItem[InventoriesFields.amount],
                context: userItem[InventoriesFields.context],
            };
            for (const field in itemFieldsMapping) {
                const serializedKey = itemFieldsMapping[field];
                const property = userItem[field];
                if (property)
                    serialized[serializedKey] = property;
            }
            data.push(serialized);
        }
        ;
        return data;
    }
};
