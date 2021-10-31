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
const supabase_client_1 = require("../../../common/supabase-client");
const obtainables = () => supabase_client_1.supabase.from('obtainables');
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
    /* Creates an obtainable record */
    createObtainable({ userID, amount = 0, isCollectible, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertData = {
                user_id: userID,
                amount,
                is_collectible: isCollectible,
            };
            if (context)
                insertData.context = context;
            const { data, error } = yield obtainables().insert(insertData);
            if (error)
                throw error;
            const obtainableRecord = data === null || data === void 0 ? void 0 : data.pop();
            if (!obtainableRecord)
                throw new Error('Obtainable record not created');
            return true;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    getObtainable({ userID, isCollectible, context, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = obtainables()
                .select()
                .eq(ObtainableFields.user_id, userID)
                .is(ObtainableFields.is_collectible, isCollectible ? true : false);
            if (context)
                query.eq(ObtainableFields.context, context);
            const { data, error } = yield query;
            if (error)
                throw error;
            return (_a = data === null || data === void 0 ? void 0 : data.pop()) === null || _a === void 0 ? void 0 : _a.amount;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    updateObtainables({ userID, amount, isCollectible, context, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = obtainables()
                .update({ [ObtainableFields.amount]: amount })
                .match({ [ObtainableFields.user_id]: userID })
                .is(ObtainableFields.is_collectible, isCollectible ? true : false);
            if (context)
                query.eq(ObtainableFields.context, context);
            const { data, error } = yield query;
            if (error)
                throw error;
            return (_a = data === null || data === void 0 ? void 0 : data.pop()) === null || _a === void 0 ? void 0 : _a.amount;
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    getTop({ count, isCollectible, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = obtainables()
                .select()
                .order(ObtainableFields.amount, { ascending: false })
                .is(ObtainableFields.is_collectible, isCollectible ? true : false)
                .limit(count);
            if (context)
                query.eq(ObtainableFields.context, context);
            const { data, error } = yield query;
            if (error)
                throw error;
            return data;
        });
    }
};
