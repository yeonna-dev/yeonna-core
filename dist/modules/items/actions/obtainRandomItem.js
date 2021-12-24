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
exports.obtainRandomItem = void 0;
const ItemsService_1 = require("../services/ItemsService");
const InventoriesService_1 = require("../services/InventoriesService");
const actions_1 = require("../../users/actions");
const errors_1 = require("../../../common/errors");
const ContextUtil_1 = require("../../../common/ContextUtil");
function obtainRandomItem({ userIdentifier, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Get a random item. */
        const chance = Math.random() * 100;
        const randomItem = yield ItemsService_1.ItemsService.findRandom({ chance });
        if (!randomItem)
            return;
        /* Get the user with the given identifier. */
        const userId = yield actions_1.findUser(userIdentifier);
        if (!userId)
            throw new errors_1.UserNotFound();
        /* Add item to the user. */
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildId, twitchChannelId });
        yield InventoriesService_1.InventoriesService.addUserItems({
            userId,
            items: [{ code: randomItem.code, amount: 1 }],
            context,
        });
        return randomItem;
    });
}
exports.obtainRandomItem = obtainRandomItem;
