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
const UsersService_1 = require("../services/UsersService");
const ContextUtil_1 = require("../../../common/ContextUtil");
// TODO: Join getting users with obtainables
function getTopObtainables({ count, isCollectible, discordGuildID, twitchChannelID, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildID, twitchChannelID });
        /* Get top points. */
        const top = yield ObtainableService_1.ObtainableService.getTop({
            count,
            isCollectible,
            context,
        });
        if (!top)
            return [];
        /* Get users of top points. */
        const userIDs = top.map(user => user[ObtainableService_1.ObtainableFields.user_id]);
        const users = yield UsersService_1.UsersService.find({ ids: userIDs });
        if (!users || !Array.isArray(users))
            return [];
        /* Get the user of each top record. */
        const topUsers = [];
        for (const amounts of top) {
            /* Find the user of the points. */
            let pointsUser;
            for (const user of users) {
                if (user.id === amounts[ObtainableService_1.ObtainableFields.user_id]) {
                    pointsUser = user;
                    break;
                }
            }
            if (!pointsUser)
                continue;
            topUsers.push({
                userID: pointsUser.id,
                discordID: pointsUser.discordID,
                twitchID: pointsUser.twitchID,
                amount: amounts[ObtainableService_1.ObtainableFields.amount],
            });
        }
        return topUsers;
    });
}
exports.getTopObtainables = getTopObtainables;
function getTopPoints({ count, discordGuildID, twitchChannelID, }) {
    return getTopObtainables({ count, discordGuildID, twitchChannelID });
}
exports.getTopPoints = getTopPoints;
function getTopCollectibles({ count, discordGuildID, twitchChannelID, }) {
    return getTopObtainables({ count, isCollectible: true, discordGuildID, twitchChannelID });
}
exports.getTopCollectibles = getTopCollectibles;
