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
exports.ObtainableService = exports.ObtainableField = void 0;
const DB_1 = require("../../../common/DB");
const UserService_1 = require("../../users/services/UserService");
var ObtainableField;
(function (ObtainableField) {
    ObtainableField["user_id"] = "user_id";
    ObtainableField["amount"] = "amount";
    ObtainableField["is_collectible"] = "is_collectible";
    ObtainableField["context"] = "context";
})(ObtainableField = exports.ObtainableField || (exports.ObtainableField = {}));
class ObtainableService {
    static find({ userId, isCollectible, context, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.obtainables()
                .where(ObtainableField.user_id, userId)
                .and.where(ObtainableField.is_collectible, Boolean(isCollectible));
            if (context)
                query.and.where(ObtainableField.context, context);
            const data = yield query;
            const amount = (_a = data === null || data === void 0 ? void 0 : data.pop()) === null || _a === void 0 ? void 0 : _a.amount;
            if (amount !== undefined)
                return Number(amount);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static getTop({ count, isCollectible, context, withUsers, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.obtainables()
                .orderBy(ObtainableField.amount, 'desc')
                .where(ObtainableField.is_collectible, Boolean(isCollectible))
                .and.where(ObtainableField.amount, '>', 0)
                .limit(count);
            if (context)
                query.and.where(ObtainableField.context, context);
            if (withUsers)
                query.join(UserService_1.UserService.table, ObtainableField.user_id, UserService_1.UserField.id);
            const data = yield query;
            return data.map(ObtainableService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* Creates an obtainable record.
      Returns a boolean that determines if the record was created or not. */
    static create({ userId, amount = 0, isCollectible, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Try to find the obtainable record with the given `userId`, `is_collectible`
              and `context` fields first before inserting to ensure of no duplicates. */
            const existingQuery = DB_1.DB.obtainables()
                .where(ObtainableField.user_id, userId);
            if (isCollectible)
                existingQuery.and.where(ObtainableField.is_collectible, Boolean(isCollectible));
            if (context)
                existingQuery.and.where(ObtainableField.context, context);
            const existing = yield existingQuery;
            if (existing.length > 0)
                return false;
            const insertData = {
                [ObtainableField.user_id]: userId,
                [ObtainableField.amount]: amount,
                [ObtainableField.is_collectible]: isCollectible,
            };
            if (context)
                insertData[ObtainableField.context] = context;
            const data = yield DB_1.DB.obtainables().insert(insertData).returning('*');
            const obtainableRecord = data === null || data === void 0 ? void 0 : data.pop();
            if (!obtainableRecord)
                throw new Error('Obtainable record not created');
            return true;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static update({ userId, amount, addAmount, isCollectible, context, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (amount === undefined && addAmount === undefined)
                return;
            let updateExpression = `${amount}`;
            if (addAmount)
                updateExpression = `${ObtainableField.amount} + ${addAmount}`;
            const query = DB_1.DB.obtainables()
                .update({ [ObtainableField.amount]: DB_1.DB.knex.raw(updateExpression) })
                .returning('*')
                .where(ObtainableField.user_id, userId)
                .and.where(ObtainableField.is_collectible, Boolean(isCollectible));
            if (context)
                query.and.where(ObtainableField.context, context);
            const data = yield query;
            const resultAmount = (_a = data === null || data === void 0 ? void 0 : data.pop()) === null || _a === void 0 ? void 0 : _a.amount;
            if (resultAmount)
                return Number(resultAmount);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static reset({ isCollectible, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.obtainables()
                .update({ [ObtainableField.amount]: 0 })
                .returning('*')
                .where(ObtainableField.is_collectible, Boolean(isCollectible));
            if (context)
                query.and.where(ObtainableField.context, context);
            const data = yield query;
            return data.map(ObtainableService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(obtainableRecord) {
        return {
            user: {
                id: obtainableRecord[ObtainableField.user_id],
                discordId: obtainableRecord[UserService_1.UserField.discord_id],
                twitchId: obtainableRecord[UserService_1.UserField.twitch_id],
            },
            amount: obtainableRecord[ObtainableField.amount],
            context: obtainableRecord[ObtainableField.context],
            isCollectible: obtainableRecord[ObtainableField.is_collectible],
        };
    }
}
exports.ObtainableService = ObtainableService;
;
