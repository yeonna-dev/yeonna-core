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
exports.checkForCollection = void 0;
const CollectionsService_1 = require("../services/CollectionsService");
const InventoriesService_1 = require("../services/InventoriesService");
const actions_1 = require("../../users/actions");
const ContextUtil_1 = require("../../../common/ContextUtil");
const errors_1 = require("../../../common/errors");
function checkForCollection({ userIdentifier, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Get the user with the given identifier. */
        const userId = yield actions_1.findUser(userIdentifier);
        if (!userId)
            throw new errors_1.UserNotFound();
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildId, twitchChannelId });
        /* Get the items of the user. */
        const inventory = yield InventoriesService_1.InventoriesService.getUserItems(userId, context);
        if (!inventory || inventory.length === 0)
            return;
        /* Get the item codes of the items of the user. */
        const itemCodes = inventory.map(({ code }) => code);
        /* Save and get all new completed collections. */
        return CollectionsService_1.CollectionsService.saveCompleted({
            userId,
            itemCodes,
            context,
        });
    });
}
exports.checkForCollection = checkForCollection;
