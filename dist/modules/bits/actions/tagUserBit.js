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
exports.tagUserBit = void 0;
const __1 = require("../../..");
const BitService_1 = require("../services/BitService");
const TagService_1 = require("../services/TagService");
function tagUserBit({ userIdentifier, bitContent, tags, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Get the bit with the given content. */
        const bit = yield BitService_1.BitService.find({ content: bitContent });
        if (bit.length === 0)
            throw new __1.BitNotFound();
        /* Get the tags with the given names. */
        const foundTags = yield TagService_1.TagService.find({ names: tags });
        if (!foundTags || foundTags.length === 0)
            throw new __1.TagsNotFound();
        /* Update the user's bit with the new tags. */
        // const updated = await UsersBitsService.addTags({  });
    });
}
exports.tagUserBit = tagUserBit;
