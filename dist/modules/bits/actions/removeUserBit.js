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
const providers_1 = require("../../../common/providers");
const BitService_1 = require("../services/BitService");
const UserBitService_1 = require("../services/UserBitService");
const removeUserBits = ({ userIdentifier, bitId, }) => __awaiter(void 0, void 0, void 0, function* () {
    return providers_1.withUser({ userIdentifier })((userId) => __awaiter(void 0, void 0, void 0, function* () {
        /* Check if bit is existing. */
        const [foundBit] = yield BitService_1.BitService.find({ ids: [bitId] });
        bitId = foundBit.id;
        if (!foundBit)
            throw new errors_1.BitNotFound();
        /* Check if the bit has been added to the user. */
        const [userBit] = yield UserBitService_1.UserBitService.find({ userIds: [userId], bitIds: [bitId] });
        if (!userBit)
            throw new errors_1.UserBitNotFound();
        return UserBitService_1.UserBitService.remove({ userId, bitId });
    }), {});
});
exports.removeUserBits = removeUserBits;
