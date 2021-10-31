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
const supabase_client_1 = require("../../../common/supabase-client");
const inventories = () => supabase_client_1.supabase.from('inventories');
var InventoriesFields;
(function (InventoriesFields) {
    InventoriesFields["pk_id"] = "pk_id";
    InventoriesFields["user_id"] = "user_id";
    InventoriesFields["item_code"] = "item_code";
    InventoriesFields["amount"] = "amount";
    InventoriesFields["context"] = "context";
    InventoriesFields["created_at"] = "created_at";
    InventoriesFields["updated_at"] = "updated_at";
    InventoriesFields["deleted_at"] = "deleted_at";
})(InventoriesFields = exports.InventoriesFields || (exports.InventoriesFields = {}));
;
exports.InventoriesService = new class {
    getUserItems(userID, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = inventories()
                .select()
                .eq(InventoriesFields.user_id, userID);
            if (context)
                query.eq(InventoriesFields.context, context);
            const { data, error } = yield query;
            if (error)
                throw error;
            // TODO: Flip condition
            return !data || data.length === 0 ? [] : this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    // TODO: Use upsert
    updateOrCreateUserItem({ userID, itemCode, amount = 1, context, add, remove, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = {
                [InventoriesFields.item_code]: itemCode,
                [InventoriesFields.user_id]: userID,
            };
            /* Get the user's current item. */
            const { data: itemRecords, error: getError } = yield inventories()
                .select()
                .match(match);
            if (getError)
                throw getError;
            /* If the user doesn't have the item, create the inventory record. */
            const [item] = itemRecords || [];
            if (!item && !remove) {
                const { error } = yield inventories()
                    .insert({
                    [InventoriesFields.item_code]: itemCode,
                    [InventoriesFields.user_id]: userID,
                    [InventoriesFields.amount]: amount,
                    [InventoriesFields.context]: context,
                });
                if (error)
                    throw error;
                return;
            }
            /* Update the user's item amount. */
            const previousAmount = item[InventoriesFields.amount];
            let newAmount = amount;
            if (add)
                newAmount += previousAmount;
            if (remove)
                newAmount = previousAmount === 0 ? 0 : previousAmount - 1;
            const { error } = yield inventories()
                .update({ [InventoriesFields.amount]: newAmount })
                .match(match);
            if (error)
                throw error;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    updateUserItems({ userID, items, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const amountsMap = {};
            for (const { code, amount } of items)
                amountsMap[code] = amount;
            const { data: userItems, error: getError } = yield inventories()
                .select()
                .eq(InventoriesFields.user_id, userID)
                .in(InventoriesFields.item_code, items.map(({ code }) => code));
            if (getError)
                throw getError;
            if (!userItems)
                return;
            const upsertDataMap = {};
            for (const item of userItems) {
                const code = item[InventoriesFields.item_code];
                upsertDataMap[code] =
                    {
                        [InventoriesFields.pk_id]: item[InventoriesFields.pk_id],
                        [InventoriesFields.user_id]: userID,
                        [InventoriesFields.item_code]: code,
                        [InventoriesFields.amount]: amountsMap[code],
                        [InventoriesFields.context]: context,
                    };
            }
            for (const code in amountsMap) {
                if (upsertDataMap[code])
                    continue;
                upsertDataMap[code] =
                    {
                        // TODO: Add unique column for upsert
                        [InventoriesFields.pk_id]: 9999,
                        [InventoriesFields.user_id]: userID,
                        [InventoriesFields.item_code]: code,
                        [InventoriesFields.amount]: amountsMap[code],
                        [InventoriesFields.context]: context,
                    };
            }
            const { data, error } = yield inventories()
                .upsert(Object.values(upsertDataMap));
            if (error)
                throw error;
            // TODO: Flip condition
            return !data || data.length === 0 ? [] : this.serialize(data);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    serialize(items) {
        return items.map(item => ({
            itemCode: item[InventoriesFields.item_code],
            amount: item[InventoriesFields.amount],
            context: item[InventoriesFields.context],
        }));
    }
};
