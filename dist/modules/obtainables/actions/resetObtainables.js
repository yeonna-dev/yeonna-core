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
exports.resetCollectibles = exports.resetPoints = exports.resetObtainables = void 0;
const providers_1 = require("../../../common/providers");
const ObtainableService_1 = require("../services/ObtainableService");
const resetObtainables = (_a) => {
    var { isCollectible } = _a, identifiers = __rest(_a, ["isCollectible"]);
    return providers_1.withContext(identifiers)((context) => __awaiter(void 0, void 0, void 0, function* () {
        return (context ? ObtainableService_1.ObtainableService.reset({
            isCollectible,
            context,
        }) : undefined);
    }));
};
exports.resetObtainables = resetObtainables;
const resetPoints = (parameters) => exports.resetObtainables(parameters);
exports.resetPoints = resetPoints;
const resetCollectibles = (parameters) => exports.resetObtainables(Object.assign(Object.assign({}, parameters), { isCollectible: true }));
exports.resetCollectibles = resetCollectibles;
