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
exports.get = void 0;
const providers_1 = require("../../../common/providers");
const StreakService_1 = require("../services/StreakService");
const get = (identifiers) => __awaiter(void 0, void 0, void 0, function* () {
    return providers_1.withUserAndContext(identifiers)((userId, context) => __awaiter(void 0, void 0, void 0, function* () { return StreakService_1.StreakService.get({ userId, context }); }), {
        requireContextParameters: true,
        createNonexistentUser: true,
    });
});
exports.get = get;
