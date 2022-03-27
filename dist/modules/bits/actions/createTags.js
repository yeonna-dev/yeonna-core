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
exports.createTags = void 0;
const TagsService_1 = require("../services/TagsService");
function createTags(names) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
          Only create new tags for the given names that are not names of existing tags.
          After tags have been created, return the merged IDs of the existing and created tags.
        */
        const found = yield TagsService_1.TagsService.find({ names });
        const foundNames = found.map(({ name }) => name);
        const newTags = names.filter(name => !foundNames.includes(name));
        let createdTags = [];
        if (newTags.length !== 0)
            createdTags = yield TagsService_1.TagsService.create(newTags);
        return createdTags.concat(found);
    });
}
exports.createTags = createTags;
