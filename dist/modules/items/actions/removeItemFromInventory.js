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
exports.removeItemFromInventory = void 0;
const ItemsService_1 = require("../services/ItemsService");
const errors_1 = require("../../../common/errors");
function removeItemFromInventory(itemCode) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Get the item with the given code. */
        const [item] = yield ItemsService_1.ItemsService.find({ code: itemCode });
        if (!item)
            throw new errors_1.ItemNotFound();
        /* Update the user's inventory to remove  */
    });
}
exports.removeItemFromInventory = removeItemFromInventory;
