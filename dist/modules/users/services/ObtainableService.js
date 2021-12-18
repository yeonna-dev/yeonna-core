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
var ObtainableFields;
(function (ObtainableFields) {
    ObtainableFields["user_id"] = "user_id";
    ObtainableFields["amount"] = "amount";
    ObtainableFields["is_collectible"] = "is_collectible";
    ObtainableFields["context"] = "context";
    ObtainableFields["created_at"] = "created_at";
    ObtainableFields["updated_at"] = "updated_at";
    ObtainableFields["deleted_at"] = "deleted_at";
})(ObtainableFields = exports.ObtainableFields || (exports.ObtainableFields = {}));
exports.ObtainableService = new class {
    find({ userID, isCollectible, context, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.obtainables()
                .where(ObtainableFields.user_id, userID)
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
    /* Creates an obtainable record */
    create({ userID, amount = 0, isCollectible, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertData = {
                user_id: userID,
                amount,
                is_collectible: isCollectible,
            };
            if (context)
                insertData.context = context;
            const data = yield DB_1.DB.obtainables().insert(insertData).returning('*');
            const obtainableRecord = data === null || data === void 0 ? void 0 : data.pop();
            if (!obtainableRecord)
                throw new Error('Obtainable record not created');
            return true;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    update({ userID, amount, isCollectible, context, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.obtainables()
                .update({ [ObtainableFields.amount]: amount })
                .returning('*')
                .where(ObtainableFields.user_id, userID)
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
    getTop({ count, isCollectible, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.obtainables()
                .orderBy(ObtainableFields.amount, 'desc')
                .where(ObtainableFields.is_collectible, Boolean(isCollectible))
                .limit(count);
            if (context)
                query.and.where(ObtainableFields.context, context);
            return query;
        });
    }
};
