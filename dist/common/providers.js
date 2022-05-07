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
exports.withUserAndContext = exports.withContext = exports.withUser = void 0;
const actions_1 = require("../modules/users/actions");
const ContextUtil_1 = require("./ContextUtil");
const errors_1 = require("./errors");
const withUser = (identifiers) => ((callback, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { createNonexistentUser, silentErrors } = options || {};
    let user;
    if (createNonexistentUser)
        user = yield actions_1.findOrCreateUser(identifiers);
    else {
        user = yield actions_1.findUser(identifiers.userIdentifier);
        if (!silentErrors && !user)
            throw new errors_1.UserNotFound();
    }
    return callback(user);
}));
exports.withUser = withUser;
const withContext = (contextParameters) => ((callback, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { requireContextParameters } = options || {};
    const { discordGuildId, twitchChannelId } = contextParameters;
    if (requireContextParameters && !discordGuildId && !twitchChannelId)
        throw new Error('No Discord Guild ID or Twitch Channel ID provided');
    const context = ContextUtil_1.ContextUtil.createContext({ discordGuildId, twitchChannelId });
    return callback(context);
}));
exports.withContext = withContext;
const withUserAndContext = (identifiers) => ((callback, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { createNonexistentUser, requireContextParameters, silentErrors, } = options || {};
    const { userIdentifier, discordGuildId, twitchChannelId } = identifiers;
    if (requireContextParameters && !discordGuildId && !twitchChannelId)
        throw new Error('No Discord Guild ID or Twitch Channel ID provided');
    let user;
    if (createNonexistentUser)
        user = yield actions_1.findOrCreateUser(identifiers);
    else {
        user = yield actions_1.findUser(userIdentifier);
        if (!user) {
            if (!silentErrors)
                throw new errors_1.UserNotFound();
            return;
        }
    }
    const context = ContextUtil_1.ContextUtil.createContext({ discordGuildId, twitchChannelId });
    return callback(user, context);
}));
exports.withUserAndContext = withUserAndContext;
