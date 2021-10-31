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
exports.findUserBits = void 0;
const actions_1 = require("../../users/actions");
const UsersBitsService_1 = require("../services/UsersBitsService");
function findUserBits({ userIdentifier, search, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Get user with the given user identifier. */
        const userID = yield actions_1.findUser(userIdentifier);
        /* Get the user's bits and do a search by the search query if given.  */
        return UsersBitsService_1.UsersBitsService.find({ userIDs: [userID], search });
    });
}
exports.findUserBits = findUserBits;
