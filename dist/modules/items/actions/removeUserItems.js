"use strict";
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
exports.removeUserItems = void 0;
const providers_1 = require("../../../common/providers");
const InventoriesService_1 = require("../services/InventoriesService");
const removeUserItems = (_a) => {
    var { itemsToRemove } = _a, identifiers = __rest(_a, ["itemsToRemove"]);
    return providers_1.withUserAndContext(identifiers)((userId, context) => InventoriesService_1.InventoriesService.removeUserItem({
        userId,
        context,
        items: itemsToRemove.map(({ code, amount }) => ({ code, amount })),
    }));
};
exports.removeUserItems = removeUserItems;
