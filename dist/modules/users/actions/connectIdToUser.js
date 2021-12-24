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
exports.connectIdToUser = void 0;
const UsersService_1 = require("../services/UsersService");
const findUser_1 = require("./findUser");
function connectIdToUser({ userIdentifier, newDiscordId, newTwitchId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!newDiscordId && !newTwitchId)
            throw new Error('No new Discord or Twitch ID provided');
        /* Get the user/s with the given user ID/s or Discord or Twitch ID/s. */
        const user = yield findUser_1.findUser(userIdentifier);
        /* Update the user record */
        yield UsersService_1.UsersService.updateById(user, { discordId: newDiscordId, twitchId: newTwitchId });
    });
}
exports.connectIdToUser = connectIdToUser;
