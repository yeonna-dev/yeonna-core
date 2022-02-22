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
exports.ObtainableService = exports.ObtainableFields = void 0;
const DB_1 = require("../../../common/DB");
const UsersService_1 = require("./UsersService");
var ObtainableFields;
(function (ObtainableFields) {
    ObtainableFields["user_id"] = "user_id";
    ObtainableFields["amount"] = "amount";
    ObtainableFields["is_collectible"] = "is_collectible";
    ObtainableFields["context"] = "context";
})(ObtainableFields = exports.ObtainableFields || (exports.ObtainableFields = {}));
class ObtainableService {
    static find({ userId, isCollectible, context, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.obtainables()
                .where(ObtainableFields.user_id, userId)
                .and.where(ObtainableFields.is_collectible, Boolean(isCollectible));
            if (context)
                query.and.where(ObtainableFields.context, context);
            const data = yield query;
            const amount = (_a = data === null || data === void 0 ? void 0 : data.pop()) === null || _a === void 0 ? void 0 : _a.amount;
            if (amount)
                return Number(amount);
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
                .where(ObtainableFields.user_id, userId);
            if (isCollectible)
                existingQuery.and.where(ObtainableFields.is_collectible, isCollectible);
            if (context)
                existingQuery.and.where(ObtainableFields.context, context);
            const existing = yield existingQuery;
            if (existing.length > 0)
                return false;
            const insertData = {
                [ObtainableFields.user_id]: userId,
                [ObtainableFields.amount]: amount,
                [ObtainableFields.is_collectible]: isCollectible,
            };
            if (context)
                insertData[ObtainableFields.context] = context;
            const data = yield DB_1.DB.obtainables().insert(insertData).returning('*');
            const obtainableRecord = data === null || data === void 0 ? void 0 : data.pop();
            if (!obtainableRecord)
                throw new Error('Obtainable record not created');
            return true;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static update({ userId, amount, isCollectible, context, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.obtainables()
                .update({ [ObtainableFields.amount]: amount })
                .returning('*')
                .where(ObtainableFields.user_id, userId)
                .and.where(ObtainableFields.is_collectible, Boolean(isCollectible));
            if (context)
                query.and.where(ObtainableFields.context, context);
            const data = yield query;
            const resultAmount = (_a = data === null || data === void 0 ? void 0 : data.pop()) === null || _a === void 0 ? void 0 : _a.amount;
            if (resultAmount)
                return Number(resultAmount);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static getTop({ count, isCollectible, context, withUsers, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.obtainables()
                .orderBy(ObtainableFields.amount, 'desc')
                .where(ObtainableFields.is_collectible, Boolean(isCollectible))
                .and.where(ObtainableFields.amount, '>', 0)
                .limit(count);
            if (context)
                query.and.where(ObtainableFields.context, context);
            if (withUsers)
                query.join(UsersService_1.UsersService.table, ObtainableFields.user_id, UsersService_1.UsersFields.id);
            const data = yield query;
            return data.map(ObtainableService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(obtainableRecord) {
        return {
            user: {
                id: obtainableRecord[ObtainableFields.user_id],
                discordId: obtainableRecord[UsersService_1.UsersFields.discord_id],
                twitchId: obtainableRecord[UsersService_1.UsersFields.twitch_id],
            },
            amount: obtainableRecord[ObtainableFields.amount],
            context: obtainableRecord[ObtainableFields.context],
            isCollectible: obtainableRecord[ObtainableFields.is_collectible],
        };
    }
}
exports.ObtainableService = ObtainableService;
;
