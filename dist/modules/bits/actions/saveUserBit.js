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
exports.saveUserBit = void 0;
const BitsService_1 = require("../services/BitsService");
const UsersBitsService_1 = require("../services/UsersBitsService");
const actions_1 = require("../../users/actions");
const errors_1 = require("../../../common/errors");
function saveUserBit({ userIdentifier, content, discordGuildID, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!content)
            throw new errors_1.NoBitContentProvided();
        /* Check if a bit with the same content is existing. */
        const [foundBit] = yield BitsService_1.BitsService.find({ content });
        /* Create the bit if not existing. */
        let bitID;
        if (foundBit)
            bitID = foundBit.id;
        else {
            const [createdBit] = yield BitsService_1.BitsService.create([content]);
            bitID = createdBit;
        }
        /* Get the user by the given user identifier. */
        const userID = yield actions_1.findOrCreateUser({ userIdentifier, discordGuildID });
        /* Check if the bit has been added to the user. */
        const [userBit] = yield UsersBitsService_1.UsersBitsService.find({ userIDs: [userID], bitIDs: [bitID] });
        /* Save the bit for the user if the user does not have the bit. */
        if (userBit)
            return;
        const [createdUserBit] = yield UsersBitsService_1.UsersBitsService.create([{ userID, bitID }]);
        return createdUserBit;
    });
}
exports.saveUserBit = saveUserBit;
