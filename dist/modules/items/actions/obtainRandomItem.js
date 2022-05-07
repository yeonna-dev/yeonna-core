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
exports.obtainRandomItem = void 0;
const providers_1 = require("../../../common/providers");
const InventoriesService_1 = require("../services/InventoriesService");
const ItemsService_1 = require("../services/ItemsService");
const obtainRandomItem = (identifiers) => providers_1.withUserAndContext(identifiers)((userId, context) => __awaiter(void 0, void 0, void 0, function* () {
    /* Get a random item. */
    const chance = Math.random() * 100;
    const randomItem = yield ItemsService_1.ItemsService.findRandom(chance, context);
    if (!randomItem)
        return;
    /* Add item to the user. */
    yield InventoriesService_1.InventoriesService.addUserItems({
        userId,
        items: [{ code: randomItem.code, amount: 1 }],
        context,
    });
    return randomItem;
}), { createNonexistentUser: true });
exports.obtainRandomItem = obtainRandomItem;
