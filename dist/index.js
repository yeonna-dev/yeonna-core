"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
require('dotenv').config();
const bits = __importStar(require("./modules/bits/actions"));
const discord = __importStar(require("./modules/discord/actions"));
const items = __importStar(require("./modules/items/actions"));
const obtainables = __importStar(require("./modules/obtainables/actions"));
const streaks = __importStar(require("./modules/streaks/actions"));
const timeLogs = __importStar(require("./modules/timeLogs/actions"));
const users = __importStar(require("./modules/users/actions"));
__exportStar(require("./common/errors"), exports);
class Core {
}
exports.Core = Core;
Core.Users = users;
Core.Obtainables = obtainables;
Core.Items = items;
Core.Bits = bits;
Core.Discord = discord;
Core.Streaks = streaks;
Core.TimeLogs = timeLogs;
