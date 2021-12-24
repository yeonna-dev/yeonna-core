"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextUtil = exports.ContextPlatforms = void 0;
var ContextPlatforms;
(function (ContextPlatforms) {
    ContextPlatforms["Discord"] = "discord";
    ContextPlatforms["Twitch"] = "twitch";
})(ContextPlatforms = exports.ContextPlatforms || (exports.ContextPlatforms = {}));
class ContextUtil {
    static createContext({ discordGuildId, twitchChannelId, }) {
        if (!discordGuildId && !twitchChannelId)
            return;
        const platform = discordGuildId ? ContextPlatforms.Discord : ContextPlatforms.Twitch;
        return `${platform}:${discordGuildId || twitchChannelId}`;
    }
}
exports.ContextUtil = ContextUtil;
