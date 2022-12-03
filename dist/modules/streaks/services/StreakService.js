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
exports.StreakService = exports.StreakField = void 0;
const DB_1 = require("../../../common/DB");
var StreakField;
(function (StreakField) {
    StreakField["user_id"] = "user_id";
    StreakField["count"] = "count";
    StreakField["longest"] = "longest";
    StreakField["context"] = "context";
    StreakField["created_at"] = "created_at";
    StreakField["updated_at"] = "updated_at";
})(StreakField = exports.StreakField || (exports.StreakField = {}));
;
class StreakService {
    static get({ userId, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.streaks()
                .where(StreakField.user_id, userId);
            if (context)
                query.and.where(StreakField.context, context);
            const streak = yield query.first();
            if (!streak)
                return;
            return StreakService.serialize(streak);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static create({ count, userId, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [createdStreak] = yield DB_1.DB.streaks()
                .insert({
                [StreakField.user_id]: userId,
                [StreakField.count]: count,
                [StreakField.longest]: count,
                [StreakField.context]: context,
            })
                .returning('*');
            if (!createdStreak)
                return;
            return StreakService.serialize(createdStreak);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static update({ userId, count, longest, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {
                [StreakField.count]: count,
                [StreakField.updated_at]: DB_1.DB.knex.fn.now(),
            };
            if (longest)
                updateData[StreakField.longest] = longest;
            const query = DB_1.DB.streaks()
                .where(StreakField.user_id, userId);
            if (context)
                query.and.where(StreakField.context, context);
            const [updatedStreak] = yield query
                .update(updateData)
                .returning('*');
            if (!updatedStreak)
                return;
            return StreakService.serialize(updatedStreak);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(streak) {
        return ({
            userId: streak.user_id,
            count: streak.count,
            longest: streak.longest,
            context: streak.context,
            createdAt: streak.created_at,
            updatedAt: streak.updated_at,
        });
    }
}
exports.StreakService = StreakService;
/* Table name is added here to be able to use in joins in other services. */
StreakService.table = 'streaks';
;
