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
exports.getUserItems = void 0;
const InventoriesService_1 = require("../services/InventoriesService");
const ItemsService_1 = require("../services/ItemsService");
const actions_1 = require("../../users/actions");
const ContextUtil_1 = require("../../../common/ContextUtil");
const errors_1 = require("../../../common/errors");
function getUserItems({ userIdentifier, discordGuildID, twitchChannelID, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Get the user with the given identifier. */
        const userID = yield actions_1.findUser(userIdentifier);
        if (!userID)
            throw new errors_1.UserNotFound();
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildID, twitchChannelID });
        const inventory = yield InventoriesService_1.InventoriesService.getUserItems(userID, context);
        /* Get the item codes of the inventory items and create an object map
          of each inventory item with the item code as the key. */
        const codes = [];
        const inventoryMap = {};
        for (const item of inventory) {
            if (!codes.includes(item.itemCode))
                codes.push(item.itemCode);
            inventoryMap[item.itemCode] = item;
        }
        /* Get the item records of each inventory item and set the item record of each inventory item. */
        const items = yield ItemsService_1.ItemsService.findByCodes(codes);
        const inventoryItems = [];
        for (const item of items) {
            const inventoryMapItem = inventoryMap[item.code];
            if (!inventoryMapItem)
                continue;
            inventoryItems.push(Object.assign(Object.assign({}, item), { amount: inventoryMapItem.amount, context: inventoryMapItem.context }));
        }
        return inventoryItems;
    });
}
exports.getUserItems = getUserItems;
