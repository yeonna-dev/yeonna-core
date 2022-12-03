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
exports.checkForCollections = void 0;
const providers_1 = require("../../../common/providers");
const CollectionService_1 = require("../services/CollectionService");
const InventoryService_1 = require("../services/InventoryService");
const checkForCollections = (identifiers) => providers_1.withUserAndContext(identifiers)((userId, context) => __awaiter(void 0, void 0, void 0, function* () {
    /* Get the items of the user. */
    const inventory = yield InventoryService_1.InventoryService.getUserItems({ userId, context });
    if (!inventory || inventory.length === 0)
        return;
    /* Get the item codes of the items of the user. */
    const itemCodes = inventory.filter(({ amount }) => amount > 0).map(({ code }) => code);
    /* Save and get all new completed collections. */
    return CollectionService_1.CollectionService.saveCompleted({
        userId,
        itemCodes,
        context,
    });
}));
exports.checkForCollections = checkForCollections;
