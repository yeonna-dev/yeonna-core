"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCollections = void 0;
const providers_1 = require("../../../common/providers");
const CollectionsService_1 = require("../services/CollectionsService");
const getUserCollections = (identifiers) => providers_1.withUserAndContext(identifiers)((userId, context) => CollectionsService_1.CollectionsService.getCollections({ userId, context }));
exports.getUserCollections = getUserCollections;
