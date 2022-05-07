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
exports.getTopCollectibles = exports.getTopPoints = exports.getTopObtainables = void 0;
const providers_1 = require("../../../common/providers");
const ObtainableService_1 = require("../services/ObtainableService");
const getTopObtainables = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { count, isCollectible } = _a, contextParameters = __rest(_a, ["count", "isCollectible"]);
    return providers_1.withContext(contextParameters)((context) => __awaiter(void 0, void 0, void 0, function* () {
        const topObtainables = yield ObtainableService_1.ObtainableService.getTop({
            count,
            isCollectible,
            context,
            withUsers: true,
        });
        return topObtainables.map(({ user, amount }) => ({
            userId: user.id,
            discordId: user.discordId,
            twitchId: user.twitchId,
            amount,
        }));
    }));
});
exports.getTopObtainables = getTopObtainables;
const getTopPoints = (parameters) => exports.getTopObtainables(parameters);
exports.getTopPoints = getTopPoints;
const getTopCollectibles = (parameters) => exports.getTopObtainables(Object.assign(Object.assign({}, parameters), { isCollectible: true }));
exports.getTopCollectibles = getTopCollectibles;
