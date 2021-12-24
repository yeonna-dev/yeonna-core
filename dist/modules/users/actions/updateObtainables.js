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
exports.updateUserCollectibles = exports.updateUserPoints = exports.updateObtainables = void 0;
const findUser_1 = require("./findUser");
const ObtainableService_1 = require("../services/ObtainableService");
const ContextUtil_1 = require("../../../common/ContextUtil");
function updateObtainables({ userIdentifier, amount, isCollectible, add, subtract, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!discordGuildId && !twitchChannelId)
            throw new Error('No Discord Guild ID or Twitch Channel ID provided');
        amount = Math.abs(amount);
        const userId = yield findUser_1.findOrCreateUser({ userIdentifier, discordGuildId, twitchChannelId });
        if (!userId)
            throw new Error('Cannot update user points');
        /* Check if the user's obtainable record is already created. */
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildId, twitchChannelId });
        const obtainables = yield ObtainableService_1.ObtainableService.find({
            userId: userId,
            isCollectible,
            context,
        });
        /* Create the obtainable record if not existing. */
        if (obtainables === undefined)
            yield ObtainableService_1.ObtainableService.create({
                userId: userId,
                amount,
                isCollectible,
                context,
            });
        else {
            let newPoints = amount;
            if (add)
                newPoints = obtainables + amount;
            if (subtract)
                newPoints = obtainables - amount;
            return ObtainableService_1.ObtainableService.update({
                userId: userId,
                amount: newPoints,
                isCollectible,
                context,
            });
        }
    });
}
exports.updateObtainables = updateObtainables;
function updateUserPoints({ userIdentifier, amount, add, subtract, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return updateObtainables({
            userIdentifier,
            amount,
            add,
            subtract,
            discordGuildId,
            twitchChannelId,
        });
    });
}
exports.updateUserPoints = updateUserPoints;
function updateUserCollectibles({ userIdentifier, amount, add, subtract, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return updateObtainables({
            userIdentifier,
            amount,
            isCollectible: true,
            add,
            subtract,
            discordGuildId,
            twitchChannelId,
        });
    });
}
exports.updateUserCollectibles = updateUserCollectibles;
