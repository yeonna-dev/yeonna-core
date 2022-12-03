"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCollections = void 0;
const providers_1 = require("../../../common/providers");
const CollectionService_1 = require("../services/CollectionService");
const getUserCollections = (identifiers) => providers_1.withUserAndContext(identifiers)((userId, context) => CollectionService_1.CollectionService.getCollections({ userId, context }));
exports.getUserCollections = getUserCollections;
