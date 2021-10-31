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
exports.findOrCreateUser = exports.findUser = void 0;
const errors_1 = require("../../../common/errors");
const UsersService_1 = require("../services/UsersService");
function findUser(userIdentifier) {
    return __awaiter(this, void 0, void 0, function* () {
        const [user] = yield UsersService_1.UsersService.findByID(userIdentifier);
        if (!user)
            throw new errors_1.UserNotFound();
        return user.id;
    });
}
exports.findUser = findUser;
function findOrCreateUser({ userIdentifier, discordGuildID, twitchChannelID, }) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Try to use actual objects for the params instead of dynamic key names.
        let userFindKey = 'ids';
        let userCreateKey;
        if (discordGuildID) {
            userFindKey = 'discordIDs';
            userCreateKey = 'discordID';
        }
        if (twitchChannelID) {
            userFindKey = 'twitchIDs';
            userCreateKey = 'twitchID';
        }
        /* Get the user/s with the given user ID/s or Discord or Twitch ID/s. */
        const result = yield UsersService_1.UsersService.find({ [userFindKey]: userIdentifier });
        const [user] = result;
        if (!user) {
            const createUserParams = userCreateKey ? { [userCreateKey]: userIdentifier } : {};
            const createdUserID = yield UsersService_1.UsersService.create(createUserParams);
            if (!createdUserID)
                throw new Error('User not saved');
            return createdUserID;
        }
        if (!user)
            return;
        if (!Array.isArray(user))
            return user.id;
        if (user.length === 0)
            return;
        return (_a = user.pop()) === null || _a === void 0 ? void 0 : _a.id;
    });
}
exports.findOrCreateUser = findOrCreateUser;
