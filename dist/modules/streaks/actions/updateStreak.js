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
exports.update = void 0;
const providers_1 = require("../../../common/providers");
const StreakService_1 = require("../services/StreakService");
const update = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { count, increment, decrement } = _a, identifiers = __rest(_a, ["count", "increment", "decrement"]);
    return providers_1.withUserAndContext(identifiers)((userId, context) => __awaiter(void 0, void 0, void 0, function* () {
        const existingStreak = yield StreakService_1.StreakService.get({ userId, context });
        const currentStreakCount = (existingStreak === null || existingStreak === void 0 ? void 0 : existingStreak.count) || 0;
        if (!count) {
            if (increment)
                count = currentStreakCount + 1;
            else if (decrement)
                count = currentStreakCount - 1;
            else
                count = 0;
        }
        if (count < 0)
            count = 0;
        let longest;
        if (count > ((existingStreak === null || existingStreak === void 0 ? void 0 : existingStreak.longest) || 0))
            longest = count;
        const newStreak = existingStreak
            ? yield StreakService_1.StreakService.update({ userId, context, count, longest })
            : yield StreakService_1.StreakService.create({ userId, context, count });
        if (!newStreak)
            return;
        return {
            current: newStreak,
            previous: existingStreak,
        };
    }), {
        requireContextParameters: true,
        createNonexistentUser: true,
    });
});
exports.update = update;
