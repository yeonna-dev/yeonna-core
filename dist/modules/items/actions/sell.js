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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellByCategory = exports.sellAllItems = exports.sellDuplicateItems = void 0;
const providers_1 = require("../../../common/providers");
const ObtainableService_1 = require("../../obtainables/services/ObtainableService");
const InventoryService_1 = require("../services/InventoryService");
const getUserItems_1 = require("./getUserItems");
var SellMode;
(function (SellMode) {
    SellMode[SellMode["All"] = 0] = "All";
    SellMode[SellMode["Duplicates"] = 1] = "Duplicates";
    SellMode[SellMode["Single"] = 2] = "Single";
    SellMode[SellMode["Category"] = 3] = "Category";
})(SellMode || (SellMode = {}));
const sell = (_a) => {
    var { sellMode, category } = _a, identifiers = __rest(_a, ["sellMode", "category"]);
    return providers_1.withUserAndContext(identifiers)((userId, context) => __awaiter(void 0, void 0, void 0, function* () {
        /* Get the user items. */
        const userItems = yield getUserItems_1.getUserItems(identifiers);
        if (!userItems)
            return;
        category = category === null || category === void 0 ? void 0 : category.toLowerCase();
        const itemsToUpdate = [];
        const soldItems = [];
        let sellPrice = 0;
        if ([SellMode.All, SellMode.Duplicates, SellMode.Category].includes(sellMode)) {
            /* Get the total price of the items to be sold and form
              the update data, which will update all the item amounts. */
            for (let { code, amount, category: itemCategory, price } of userItems) {
                itemCategory = itemCategory === null || itemCategory === void 0 ? void 0 : itemCategory.toLowerCase();
                let newAmount;
                if (sellMode === SellMode.All ||
                    (sellMode === SellMode.Category && category === itemCategory))
                    newAmount = 0;
                if (sellMode === SellMode.Duplicates && amount > 1)
                    newAmount = 1;
                if (newAmount === undefined)
                    continue;
                sellPrice += (amount - newAmount) * (price || 0);
                soldItems.push({ code, amount });
                itemsToUpdate.push({ code, amount: newAmount });
            }
        }
        /* Update the item amounts. */
        if (itemsToUpdate.length > 0)
            yield InventoryService_1.InventoryService.updateUserItemAmounts({
                userId,
                items: itemsToUpdate,
                context,
            });
        /* Add the total price of the items to the user's points. */
        if (sellPrice > 0)
            yield ObtainableService_1.ObtainableService.update({
                userId,
                addAmount: sellPrice,
                context,
            });
        return {
            sellPrice,
            soldItems,
        };
    }));
};
const sellDuplicateItems = (identifiers) => sell(Object.assign(Object.assign({}, identifiers), { sellMode: SellMode.Duplicates }));
exports.sellDuplicateItems = sellDuplicateItems;
const sellAllItems = (identifiers) => sell(Object.assign(Object.assign({}, identifiers), { sellMode: SellMode.All }));
exports.sellAllItems = sellAllItems;
const sellByCategory = (_a) => {
    var { category } = _a, identifiers = __rest(_a, ["category"]);
    return sell(Object.assign(Object.assign({}, identifiers), { category, sellMode: SellMode.Category }));
};
exports.sellByCategory = sellByCategory;
