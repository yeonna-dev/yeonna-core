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
exports.get = void 0;
const ContextUtil_1 = require("../../../common/ContextUtil");
const errors_1 = require("../../../common/errors");
const actions_1 = require("../../users/actions");
const StreakService_1 = require("../services/StreakService");
function get({ userIdentifier, discordGuildId, twitchChannelId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!discordGuildId && !twitchChannelId)
            throw new Error('No Discord Guild ID or Twitch Channel ID provided');
        /* Get the user with the given identifier. */
        const userId = yield actions_1.findOrCreateUser({ userIdentifier, discordGuildId });
        if (!userId)
            throw new errors_1.UserNotFound();
        const context = ContextUtil_1.ContextUtil.createContext({ discordGuildId, twitchChannelId });
        return StreakService_1.StreakService.get({ userId, context });
    });
}
exports.get = get;
