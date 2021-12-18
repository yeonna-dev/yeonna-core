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
exports.getUserCollectibles = exports.getUserPoints = exports.getObtainables = void 0;
const findUser_1 = require("./findUser");
const ObtainableService_1 = require("../services/ObtainableService");
const ContextUtil_1 = require("../../../common/ContextUtil");
const errors_1 = require("../../../common/errors");
function getObtainables({ userIdentifier, isCollectible, discordGuildID, twitchChannelID, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!discordGuildID && !twitchChannelID)
            throw new Error('No Discord Guild ID or Twitch Channel ID provided');
        /* Check if the user is existing. */
        const userID = yield findUser_1.findUser(userIdentifier);
        if (!userID)
            throw new errors_1.UserNotFound();
        const obtainables = yield ObtainableService_1.ObtainableService.find({
            userID,
            isCollectible,
            context: ContextUtil_1.ContextUtil.createContext({ discordGuildID, twitchChannelID }),
        });
        return obtainables || 0;
    });
}
exports.getObtainables = getObtainables;
function getUserPoints({ userIdentifier, discordGuildID, twitchChannelID, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return getObtainables({
            userIdentifier,
            discordGuildID,
            twitchChannelID,
        });
    });
}
exports.getUserPoints = getUserPoints;
function getUserCollectibles({ userIdentifier, discordGuildID, twitchChannelID, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return getObtainables({
            userIdentifier,
            isCollectible: true,
            discordGuildID,
            twitchChannelID,
        });
    });
}
exports.getUserCollectibles = getUserCollectibles;
