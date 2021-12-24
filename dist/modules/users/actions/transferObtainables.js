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
exports.transferUserCollectibles = exports.transferUserPoints = exports.transferObtainables = void 0;
const findUser_1 = require("./findUser");
const getObtainables_1 = require("./getObtainables");
const ObtainableService_1 = require("../services/ObtainableService");
const ContextUtil_1 = require("../../../common/ContextUtil");
const errors_1 = require("../../../common/errors");
function transferObtainables({ fromUserIdentifier, toUserIdentifier, amount, isCollectible, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!discordGuildId && !twitchChannelId)
            throw new Error('No Discord Guild ID or Twitch Channel ID provided');
        amount = Math.abs(amount);
        /* Get the obtainables of the user to get obtainables from (source user) */
        const source = yield findUser_1.findUser(fromUserIdentifier);
        if (!source)
            throw new (isCollectible ? errors_1.NotEnoughCollectibles : errors_1.NotEnoughPoints)();
        const sourceObtainables = yield getObtainables_1.getObtainables({
            userIdentifier: source,
            isCollectible,
            discordGuildId,
            twitchChannelId,
        });
        /* Check if the source user has less obtainables than the given amount. */
        if (!sourceObtainables || sourceObtainables < amount)
            throw new (isCollectible ? errors_1.NotEnoughCollectibles : errors_1.NotEnoughPoints)();
        /* Get the obtainables of user to add obtainables to (target user). */
        const target = yield findUser_1.findOrCreateUser({
            userIdentifier: toUserIdentifier,
            discordGuildId,
            twitchChannelId,
        });
        if (!target)
            throw new Error('Cannot transfer points');
        /* Add obtainables to the target user. */
        const targetObtainables = yield getObtainables_1.getObtainables({
            userIdentifier: target,
            isCollectible,
            discordGuildId,
            twitchChannelId,
        });
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildId, twitchChannelId });
        if (!targetObtainables)
            yield ObtainableService_1.ObtainableService.create({
                userId: target,
                amount,
                isCollectible,
                context,
            });
        else
            yield ObtainableService_1.ObtainableService.update({
                userId: target,
                amount: targetObtainables + amount,
                isCollectible,
                context,
            });
        /* Subtract obtainables from the source user. */
        yield ObtainableService_1.ObtainableService.update({
            userId: source,
            amount: sourceObtainables - amount,
            isCollectible,
            context,
        });
    });
}
exports.transferObtainables = transferObtainables;
function transferUserPoints({ fromUserIdentifier, toUserIdentifier, amount, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transferObtainables({
            fromUserIdentifier,
            toUserIdentifier,
            amount,
            discordGuildId,
            twitchChannelId,
        });
    });
}
exports.transferUserPoints = transferUserPoints;
function transferUserCollectibles({ fromUserIdentifier, toUserIdentifier, amount, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transferObtainables({
            fromUserIdentifier,
            toUserIdentifier,
            amount,
            discordGuildId,
            twitchChannelId,
            isCollectible: true,
        });
    });
}
exports.transferUserCollectibles = transferUserCollectibles;
