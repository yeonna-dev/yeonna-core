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
const CollectionsService_1 = require("../services/CollectionsService");
const InventoriesService_1 = require("../services/InventoriesService");
const checkForCollections = (identifiers) => providers_1.withUserAndContext(identifiers)((userId, context) => __awaiter(void 0, void 0, void 0, function* () {
    /* Get the items of the user. */
    const inventory = yield InventoriesService_1.InventoriesService.getUserItems({ userId, context });
    if (!inventory || inventory.length === 0)
        return;
    /* Get the item codes of the items of the user. */
    const itemCodes = inventory.map(({ code }) => code);
    /* Save and get all new completed collections. */
    return CollectionsService_1.CollectionsService.saveCompleted({
        userId,
        itemCodes,
        context,
    });
}));
exports.checkForCollections = checkForCollections;
