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
exports.removeUserItem = void 0;
const ItemsService_1 = require("../services/ItemsService");
const InventoriesService_1 = require("../services/InventoriesService");
const actions_1 = require("../../users/actions");
const ContextUtil_1 = require("../../../common/ContextUtil");
const errors_1 = require("../../../common/errors");
function removeUserItem({ userIdentifier, itemCode, discordGuildID, twitchChannelID, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Get the item with the given code. */
        const [item] = yield ItemsService_1.ItemsService.find({ code: itemCode });
        if (!item)
            throw new errors_1.ItemNotFound();
        /* Get the user with the given identifier. */
        const userID = yield actions_1.findUser(userIdentifier);
        if (!userID)
            throw new errors_1.UserNotFound();
        /* Update the user's inventory to remove the given item. */
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildID, twitchChannelID });
        yield InventoriesService_1.InventoriesService.updateUserItem({
            userID,
            itemCode,
            context,
            remove: true,
        });
    });
}
exports.removeUserItem = removeUserItem;
