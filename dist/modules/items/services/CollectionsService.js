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
exports.CollectionsService = exports.UsersCollectionsFields = exports.CollectionsItemsFields = exports.CollectionsFields = void 0;
const DB_1 = require("../../../common/DB");
var CollectionsFields;
(function (CollectionsFields) {
    CollectionsFields["code"] = "code";
    CollectionsFields["name"] = "name";
    CollectionsFields["fixed_bonus"] = "fixed_bonus";
})(CollectionsFields = exports.CollectionsFields || (exports.CollectionsFields = {}));
var CollectionsItemsFields;
(function (CollectionsItemsFields) {
    CollectionsItemsFields["collection_code"] = "collection_code";
    CollectionsItemsFields["item_code"] = "item_code";
})(CollectionsItemsFields = exports.CollectionsItemsFields || (exports.CollectionsItemsFields = {}));
var UsersCollectionsFields;
(function (UsersCollectionsFields) {
    UsersCollectionsFields["user_id"] = "user_id";
    UsersCollectionsFields["context"] = "context";
    UsersCollectionsFields["collection_code"] = "collection_code";
})(UsersCollectionsFields = exports.UsersCollectionsFields || (exports.UsersCollectionsFields = {}));
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* This class includes operations that involve the `collections`,
  `collections_items`, and `users_collections` tables. */
class CollectionsService {
    static getCollections({ userId, context, collectionCodes, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersCollectionCodeField = `${CollectionsService.usersCollectionsTable}.${UsersCollectionsFields.collection_code}`;
            const query = DB_1.DB.usersCollections()
                .select(UsersCollectionsFields.user_id, UsersCollectionsFields.collection_code, UsersCollectionsFields.context, CollectionsFields.name, CollectionsFields.fixed_bonus)
                .join(CollectionsService.collections, usersCollectionCodeField, CollectionsFields.code);
            if (userId)
                query.where(UsersCollectionsFields.user_id, userId);
            if (context)
                query.and.where(UsersCollectionsFields.context, context);
            if (collectionCodes)
                query.and.whereIn(usersCollectionCodeField, collectionCodes);
            const data = yield query;
            return data.map(CollectionsService.serialize);
        });
    }
    static saveCompleted({ userId, itemCodes, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionCodeField = CollectionsItemsFields.collection_code;
            /* Get the completed collections that based on the item codes given. */
            const completedCollectionItems = yield DB_1.DB.collectionsItems()
                .select(collectionCodeField)
                .whereIn(CollectionsItemsFields.item_code, itemCodes)
                .groupBy(collectionCodeField)
                .having(DB_1.DB.knex.raw(`
        (${collectionCodeField}, count(${collectionCodeField}))
        in (${DB_1.DB.collectionsItems()
                .select(collectionCodeField, DB_1.DB.knex.raw(`count(${collectionCodeField})`))
                .groupBy(collectionCodeField)})
      `));
            const completedCollectionCodes = [];
            for (const collectionItem of completedCollectionItems) {
                const collectionCode = collectionItem[CollectionsItemsFields.collection_code];
                completedCollectionCodes.push(collectionCode);
            }
            /* Get the completed collections of the user along with the collection data. */
            const usersCollectionCodeField = `${CollectionsService.usersCollectionsTable}.${UsersCollectionsFields.collection_code}`;
            const userCollections = yield DB_1.DB.usersCollections()
                .join(CollectionsService.collections, usersCollectionCodeField, CollectionsFields.code)
                .where(UsersCollectionsFields.user_id, userId)
                .and.whereIn(usersCollectionCodeField, completedCollectionCodes);
            const userCollectionCodes = userCollections
                .map((collection) => collection[UsersCollectionsFields.collection_code]);
            const newUserCollectionsInsertData = [];
            for (const code of completedCollectionCodes) {
                if (userCollectionCodes.includes(code))
                    continue;
                newUserCollectionsInsertData.push({
                    [UsersCollectionsFields.user_id]: userId,
                    [UsersCollectionsFields.collection_code]: code,
                    [UsersCollectionsFields.context]: context,
                });
            }
            if (newUserCollectionsInsertData.length === 0)
                return [];
            /* Save the new collections for the user with the given user ID. */
            const newCompletedCollections = yield DB_1.DB.usersCollections()
                .insert(newUserCollectionsInsertData)
                .returning('*');
            return newCompletedCollections.map(CollectionsService.serialize);
        });
    }
    static serialize(userCollectionRecord) {
        const serialized = {
            userId: userCollectionRecord[UsersCollectionsFields.user_id],
            code: userCollectionRecord[UsersCollectionsFields.collection_code],
            context: userCollectionRecord[UsersCollectionsFields.context],
        };
        const collectionName = userCollectionRecord[CollectionsFields.name];
        if (collectionName)
            serialized.name = collectionName;
        const collectionFixedBonus = userCollectionRecord[CollectionsFields.fixed_bonus];
        if (collectionFixedBonus)
            serialized.fixedBonus = collectionFixedBonus;
        return serialized;
    }
}
exports.CollectionsService = CollectionsService;
CollectionsService.collections = 'collections';
CollectionsService.collectionsItemsTable = 'collections_items';
CollectionsService.usersCollectionsTable = 'users_collections';
