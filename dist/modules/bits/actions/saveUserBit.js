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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserBit = void 0;
const _1 = require(".");
const errors_1 = require("../../../common/errors");
const providers_1 = require("../../../common/providers");
const BitsService_1 = require("../services/BitsService");
const UsersBitsService_1 = require("../services/UsersBitsService");
const saveUserBit = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { content, tags } = _a, identifiers = __rest(_a, ["content", "tags"]);
    return providers_1.withUserAndContext(identifiers)((userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!content)
            throw new errors_1.NoBitContentProvided();
        /* Check if a bit with the same content is existing. */
        const [foundBit] = yield BitsService_1.BitsService.find({ content });
        /* Create the bit if not existing. */
        let bitId;
        if (foundBit)
            bitId = foundBit.id;
        else {
            const [createdBit] = yield BitsService_1.BitsService.create([content]);
            bitId = createdBit.id;
        }
        /* Check if the bit has been added to the user. */
        const [userBit] = yield UsersBitsService_1.UsersBitsService.find({
            userIds: [userId],
            bitIds: [bitId],
        });
        /* Find the tags by the given tag names. */
        let tagIds = [];
        if (tags) {
            const createdTags = yield _1.createTags(tags);
            tagIds = createdTags.map(({ id }) => id);
        }
        /* If the user already has the bit, do not save it. */
        if (userBit)
            return userBit;
        const [createdUserBit] = yield UsersBitsService_1.UsersBitsService.create([{ userId, bitId, tagIds }]);
        return createdUserBit;
    }), {
        createNonexistentUser: true,
    });
});
exports.saveUserBit = saveUserBit;
