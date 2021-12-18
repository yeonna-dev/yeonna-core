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
exports.removeUserBits = void 0;
const errors_1 = require("../../../common/errors");
const actions_1 = require("../../users/actions");
const BitsService_1 = require("../services/BitsService");
const UsersBitsService_1 = require("../services/UsersBitsService");
function removeUserBits({ userIdentifier, bitID }) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Check if bit is existing. */
        const [foundBit] = yield BitsService_1.BitsService.find({ ids: [bitID] });
        bitID = foundBit.id;
        if (!foundBit)
            throw new errors_1.BitNotFound();
        /* Get the user by the given identifier. */
        const userID = yield actions_1.findUser(userIdentifier);
        /* Check if the bit has been added to the user. */
        const [userBit] = yield UsersBitsService_1.UsersBitsService.find({ userIDs: [userID], bitIDs: [bitID] });
        if (!userBit)
            throw new errors_1.UserBitNotFound();
        return UsersBitsService_1.UsersBitsService.remove({ userID, bitID });
    });
}
exports.removeUserBits = removeUserBits;
