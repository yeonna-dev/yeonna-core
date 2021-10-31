"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextUtil = exports.ContextPlatforms = void 0;
var ContextPlatforms;
(function (ContextPlatforms) {
    ContextPlatforms["Discord"] = "discord";
    ContextPlatforms["Twitch"] = "twitch";
})(ContextPlatforms = exports.ContextPlatforms || (exports.ContextPlatforms = {}));
class ContextUtilClass {
    createContext({ discordGuildID, twitchChannelID, }) {
        if (!discordGuildID && !twitchChannelID)
            return;
        const platform = discordGuildID ? ContextPlatforms.Discord : ContextPlatforms.Twitch;
        return `${platform}:${discordGuildID || twitchChannelID}`;
    }
}
exports.ContextUtil = new ContextUtilClass();
