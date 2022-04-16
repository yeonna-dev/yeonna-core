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
exports.sellByCategory = exports.sellDuplicateItems = exports.sellAllItems = void 0;
const ContextUtil_1 = require("../../../common/ContextUtil");
const errors_1 = require("../../../common/errors");
const actions_1 = require("../../users/actions");
const ObtainableService_1 = require("../../users/services/ObtainableService");
const InventoriesService_1 = require("../services/InventoriesService");
const getUserItems_1 = require("./getUserItems");
var SellMode;
(function (SellMode) {
    SellMode[SellMode["All"] = 0] = "All";
    SellMode[SellMode["Duplicates"] = 1] = "Duplicates";
    SellMode[SellMode["Single"] = 2] = "Single";
    SellMode[SellMode["Category"] = 3] = "Category";
})(SellMode || (SellMode = {}));
function sell({ userIdentifier, sellMode, category, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Get the user with the given identifier. */
        const userId = yield actions_1.findUser(userIdentifier);
        if (!userId)
            throw new errors_1.UserNotFound();
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildId, twitchChannelId });
        /* Get the user items. */
        const userItems = yield getUserItems_1.getUserItems({
            userIdentifier,
            discordGuildId,
            twitchChannelId,
        });
        const itemsToUpdate = [];
        if ([SellMode.All, SellMode.Duplicates, SellMode.Category].includes(sellMode)) {
            /* Get the total price of the items to be sold and form
              the update data, which will update all the item amounts. */
            for (let { code, amount, category: itemCategory } of userItems) {
                let newAmount;
                if (sellMode === SellMode.All ||
                    (sellMode === SellMode.Category && category === itemCategory))
                    newAmount = 0;
                if (sellMode === SellMode.Duplicates && amount > 1)
                    newAmount = 1;
                if (newAmount !== undefined)
                    itemsToUpdate.push({ code, amount: newAmount });
            }
        }
        /* Update the item amounts. */
        let sellPrice = 0;
        let soldItems = [];
        if (itemsToUpdate.length > 0) {
            soldItems = yield InventoriesService_1.InventoriesService.updateUserItemAmounts({
                userId,
                items: itemsToUpdate,
                context,
            });
            sellPrice = soldItems.reduce((total, item) => total + (item.price || 0), 0);
        }
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
    });
}
function sellAllItems({ userIdentifier, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return sell({
            userIdentifier,
            sellMode: SellMode.All,
            discordGuildId,
            twitchChannelId,
        });
    });
}
exports.sellAllItems = sellAllItems;
function sellDuplicateItems({ userIdentifier, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return sell({
            userIdentifier,
            sellMode: SellMode.Duplicates,
            discordGuildId,
            twitchChannelId,
        });
    });
}
exports.sellDuplicateItems = sellDuplicateItems;
function sellByCategory({ userIdentifier, category, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return sell({
            userIdentifier,
            sellMode: SellMode.Category,
            category,
            discordGuildId,
            twitchChannelId,
        });
    });
}
exports.sellByCategory = sellByCategory;
