"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserItems = void 0;
const providers_1 = require("../../../common/providers");
const InventoriesService_1 = require("../services/InventoriesService");
const getUserItems = (identifiers) => providers_1.withUserAndContext(identifiers)((userId, context) => InventoriesService_1.InventoriesService.getUserItems(userId, context));
exports.getUserItems = getUserItems;
