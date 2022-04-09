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
exports.sellDuplicateItems = void 0;
const ContextUtil_1 = require("../../../common/ContextUtil");
const errors_1 = require("../../../common/errors");
const actions_1 = require("../../users/actions");
const ObtainableService_1 = require("../../users/services/ObtainableService");
const InventoriesService_1 = require("../services/InventoriesService");
const getUserItems_1 = require("./getUserItems");
function sellDuplicateItems({ userIdentifier, discordGuildId, twitchChannelId, }) {
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
        /* Get the items with duplicates and calculate the total price of all excess duplicate items. */
        let duplicatesSellPrice = 0;
        const itemsToUpdate = [];
        for (const { code, amount, price } of userItems) {
            if (amount <= 1)
                continue;
            duplicatesSellPrice += (amount - 1) * (price || 0);
            itemsToUpdate.push({
                code,
                amount: 1,
            });
        }
        /* Add the total price of all excess duplicate items to the user's points. */
        if (duplicatesSellPrice > 0)
            yield ObtainableService_1.ObtainableService.update({
                userId,
                addAmount: duplicatesSellPrice,
                context,
            });
        /* Update the duplicate item amounts to 1. */
        const updatedItems = yield InventoriesService_1.InventoriesService.updateUserItemAmounts({
            userId,
            items: itemsToUpdate,
            context,
        });
        return {
            sellPrice: duplicatesSellPrice,
            soldItems: updatedItems,
        };
    });
}
exports.sellDuplicateItems = sellDuplicateItems;
