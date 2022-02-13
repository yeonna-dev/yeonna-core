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
exports.getTopCollectibles = exports.getTopPoints = exports.getTopObtainables = void 0;
const ObtainableService_1 = require("../services/ObtainableService");
const ContextUtil_1 = require("../../../common/ContextUtil");
function getTopObtainables({ count, isCollectible, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildId, twitchChannelId });
        /* Get top points. */
        const topObtainables = yield ObtainableService_1.ObtainableService.getTop({
            count,
            isCollectible,
            context,
            withUsers: true,
        });
        return topObtainables.map(({ user, amount }) => ({
            userId: user.id,
            discordId: user.discordId,
            twitchId: user.twitchId,
            amount,
        }));
    });
}
exports.getTopObtainables = getTopObtainables;
function getTopPoints({ count, discordGuildId, twitchChannelId, }) {
    return getTopObtainables({ count, discordGuildId, twitchChannelId });
}
exports.getTopPoints = getTopPoints;
function getTopCollectibles({ count, discordGuildId, twitchChannelId, }) {
    return getTopObtainables({ count, isCollectible: true, discordGuildId, twitchChannelId });
}
exports.getTopCollectibles = getTopCollectibles;
