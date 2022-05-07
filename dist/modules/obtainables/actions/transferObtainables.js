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
const errors_1 = require("../../../common/errors");
const providers_1 = require("../../../common/providers");
const actions_1 = require("../../users/actions");
const ObtainableService_1 = require("../services/ObtainableService");
const getObtainables_1 = require("./getObtainables");
const transferObtainables = ({ fromUserIdentifier, toUserIdentifier, discordGuildId, twitchChannelId, amount, isCollectible, }) => __awaiter(void 0, void 0, void 0, function* () {
    return providers_1.withUserAndContext({
        userIdentifier: fromUserIdentifier,
        discordGuildId,
        twitchChannelId,
    })((userId, context) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId)
            throw new (isCollectible ? errors_1.NotEnoughCollectibles : errors_1.NotEnoughPoints)();
        amount = Math.abs(amount);
        /* Get the obtainables of the user to get obtainables from (source user) */
        const sourceObtainables = yield getObtainables_1.getObtainables({
            userIdentifier: userId,
            discordGuildId,
            twitchChannelId,
            isCollectible,
        });
        /* Check if the source user has less obtainables than the given amount. */
        if (!sourceObtainables || sourceObtainables < amount)
            throw new (isCollectible ? errors_1.NotEnoughCollectibles : errors_1.NotEnoughPoints)();
        const target = yield actions_1.findOrCreateUser({
            userIdentifier: toUserIdentifier,
            discordGuildId,
            twitchChannelId,
        });
        if (!target)
            throw new Error('Cannot transfer points');
        /* Add obtainables to the target user. */
        const targetObtainables = yield getObtainables_1.getObtainables({
            userIdentifier: target,
            discordGuildId,
            twitchChannelId,
            isCollectible,
        });
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
            userId,
            amount: sourceObtainables - amount,
            isCollectible,
            context,
        });
    }), {
        silentErrors: true,
        requireContextParameters: true,
    });
});
exports.transferObtainables = transferObtainables;
const transferUserPoints = (parameters) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.transferObtainables(parameters); });
exports.transferUserPoints = transferUserPoints;
const transferUserCollectibles = (parameters) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.transferObtainables(Object.assign(Object.assign({}, parameters), { isCollectible: true }));
});
exports.transferUserCollectibles = transferUserCollectibles;
