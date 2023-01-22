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
exports.TimeLogService = exports.TimeLogField = void 0;
const DB_1 = require("../../../common/DB");
const nanoid_1 = require("../../../common/nanoid");
var TimeLogField;
(function (TimeLogField) {
    TimeLogField["id"] = "id";
    TimeLogField["datetime"] = "datetime";
    TimeLogField["activity"] = "activity";
    TimeLogField["user_id"] = "user_id";
    TimeLogField["context"] = "context";
})(TimeLogField = exports.TimeLogField || (exports.TimeLogField = {}));
;
class TimeLogService {
    static get({ userId, date, context, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DB_1.DB.timeLogs()
                .where(TimeLogField.user_id, userId);
            if (date) {
                let d;
                if (date instanceof Date)
                    d = date;
                else
                    d = new Date(date);
                const dateOnly = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
                query.and.whereRaw('??::date = ?', [TimeLogField.datetime, dateOnly]);
            }
            if (context)
                query.and.where(TimeLogField.context, context);
            const timeLogs = yield query;
            return timeLogs.map(TimeLogService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static create({ userId, context, timeLogs, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeLogsArray = !Array.isArray(timeLogs) ? [timeLogs] : timeLogs;
            const data = timeLogsArray.map((timeLog) => ({
                [TimeLogField.id]: nanoid_1.nanoid(15),
                [TimeLogField.datetime]: timeLog.datetime,
                [TimeLogField.activity]: timeLog.activity,
                [TimeLogField.user_id]: userId,
                [TimeLogField.context]: context,
            }));
            const createdTimeLogs = yield DB_1.DB.timeLogs()
                .insert(data)
                .returning('*');
            if (!createdTimeLogs)
                return;
            return createdTimeLogs.map(TimeLogService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static remove({ userId, context, timeLogIds, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeLogIdsArray = !Array.isArray(timeLogIds) ? [timeLogIds] : timeLogIds;
            let query = DB_1.DB.timeLogs()
                .delete()
                .whereIn(TimeLogField.id, timeLogIdsArray)
                .and.where(TimeLogField.user_id, userId)
                .returning('*');
            if (context)
                query.and.where(TimeLogField.context, context);
            const deletedTimeLogs = yield query;
            if (!deletedTimeLogs)
                return;
            return deletedTimeLogs.map(TimeLogService.serialize);
        });
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    static serialize(timeLogRecord) {
        return ({
            id: timeLogRecord[TimeLogField.id],
            datetime: timeLogRecord[TimeLogField.datetime].toISOString(),
            activity: timeLogRecord[TimeLogField.activity],
            userId: timeLogRecord[TimeLogField.user_id],
            context: timeLogRecord[TimeLogField.context],
        });
    }
}
exports.TimeLogService = TimeLogService;
;
