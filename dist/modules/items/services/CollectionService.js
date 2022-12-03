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
exports.CollectionService = exports.UserCollectionField = exports.CollectionItemField = exports.CollectionField = void 0;
const DB_1 = require("../../../common/DB");
var CollectionField;
(function (CollectionField) {
    CollectionField["code"] = "code";
    CollectionField["name"] = "name";
    CollectionField["fixed_bonus"] = "fixed_bonus";
    CollectionField["context"] = "context";
})(CollectionField = exports.CollectionField || (exports.CollectionField = {}));
var CollectionItemField;
(function (CollectionItemField) {
    CollectionItemField["collection_code"] = "collection_code";
    CollectionItemField["item_code"] = "item_code";
})(CollectionItemField = exports.CollectionItemField || (exports.CollectionItemField = {}));
var UserCollectionField;
(function (UserCollectionField) {
    UserCollectionField["user_id"] = "user_id";
    UserCollectionField["context"] = "context";
    UserCollectionField["collection_code"] = "collection_code";
})(UserCollectionField = exports.UserCollectionField || (exports.UserCollectionField = {}));
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* This class includes operations that involve the `collections`,
  `collections_items`, and `users_collections` tables. */
class CollectionService {
    static getCollections({ userId, context, collectionCodes, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersCollectionsContextField = `${CollectionService.usersCollectionsTable}.${UserCollectionField.context}`;
            const usersCollectionsCodeField = `${CollectionService.usersCollectionsTable}.${UserCollectionField.collection_code}`;
            const query = DB_1.DB.usersCollections()
                .select(UserCollectionField.user_id, UserCollectionField.collection_code, usersCollectionsContextField, CollectionField.name, CollectionField.fixed_bonus)
                .join(CollectionService.collections, usersCollectionsCodeField, CollectionField.code);
            if (userId)
                query.where(UserCollectionField.user_id, userId);
            if (context)
                query.and.where(usersCollectionsContextField, context);
            if (collectionCodes)
                query.and.whereIn(usersCollectionsCodeField, collectionCodes);
            const data = yield query;
            return data.map(CollectionService.serializeUserCollection);
        });
    }
    static saveCompleted({ userId, itemCodes, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionCodeField = CollectionItemField.collection_code;
            /* Get the completed collections that based on the item codes given. */
            const collectionItemsQuery = DB_1.DB.collectionsItems()
                .select(collectionCodeField)
                .whereIn(CollectionItemField.item_code, itemCodes)
                .groupBy(collectionCodeField)
                .having(DB_1.DB.knex.raw(`
        (${collectionCodeField}, count(${collectionCodeField}))
        in (${DB_1.DB.collectionsItems()
                .select(collectionCodeField, DB_1.DB.knex.raw(`count(${collectionCodeField})`))
                .groupBy(collectionCodeField)})
      `));
            if (context)
                collectionItemsQuery
                    .join(CollectionService.collections, CollectionItemField.collection_code, CollectionField.code)
                    .and.where(CollectionField.context, context);
            const completedCollections = yield collectionItemsQuery;
            const completedCollectionCodes = completedCollections
                .map(collection => collection[CollectionItemField.collection_code]);
            /* Get the completed collections of the user along with the collection data. */
            const usersCollectionsCodeField = UserCollectionField.collection_code;
            const usersCollectionsCodeJoinField = `${CollectionService.usersCollectionsTable}.${usersCollectionsCodeField}`;
            const userCollections = yield DB_1.DB.usersCollections()
                .select(usersCollectionsCodeField)
                .join(CollectionService.collections, usersCollectionsCodeJoinField, CollectionField.code)
                .where(UserCollectionField.user_id, userId)
                .and.whereIn(usersCollectionsCodeJoinField, completedCollectionCodes);
            const userCollectionCodes = userCollections.map(collection => collection[UserCollectionField.collection_code]);
            const newUserCollectionsInsertData = [];
            for (const code of completedCollectionCodes) {
                if (userCollectionCodes.includes(code))
                    continue;
                newUserCollectionsInsertData.push({
                    [UserCollectionField.user_id]: userId,
                    [usersCollectionsCodeField]: code,
                    [UserCollectionField.context]: context,
                });
            }
            if (newUserCollectionsInsertData.length === 0)
                return [];
            /* Save the new collections for the user with the given user ID. */
            const newUserCollections = yield DB_1.DB.usersCollections()
                .insert(newUserCollectionsInsertData)
                .returning(usersCollectionsCodeField);
            /* Get the collections data of the new completed collections. */
            const collectionCodes = newUserCollections.map(collection => collection[UserCollectionField.collection_code]);
            const collections = yield DB_1.DB.collections()
                .whereIn(CollectionField.code, collectionCodes);
            return collections.map(CollectionService.serializeCollection);
        });
    }
    static serializeCollection(collection) {
        return {
            code: collection[CollectionField.code],
            name: collection[CollectionField.name],
            fixedBonus: collection[CollectionField.fixed_bonus],
        };
    }
    static serializeUserCollection(userCollectionRecord) {
        const serialized = {
            userId: userCollectionRecord[UserCollectionField.user_id],
            code: userCollectionRecord[UserCollectionField.collection_code],
            context: userCollectionRecord[UserCollectionField.context],
        };
        const collectionName = userCollectionRecord[CollectionField.name];
        if (collectionName)
            serialized.name = collectionName;
        const collectionFixedBonus = userCollectionRecord[CollectionField.fixed_bonus];
        if (collectionFixedBonus)
            serialized.fixedBonus = collectionFixedBonus;
        return serialized;
    }
}
exports.CollectionService = CollectionService;
CollectionService.collections = 'collections';
CollectionService.collectionsItemsTable = 'collections_items';
CollectionService.usersCollectionsTable = 'users_collections';
