"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextUtil = exports.ContextPlatform = void 0;
var ContextPlatform;
(function (ContextPlatform) {
    ContextPlatform["Discord"] = "discord";
    ContextPlatform["Twitch"] = "twitch";
})(ContextPlatform = exports.ContextPlatform || (exports.ContextPlatform = {}));
class ContextUtil {
    static createContext({ discordGuildId, twitchChannelId, }) {
        if (!discordGuildId && !twitchChannelId)
            return;
        const platform = discordGuildId ? ContextPlatform.Discord : ContextPlatform.Twitch;
        return `${platform}:${discordGuildId || twitchChannelId}`;
    }
}
exports.ContextUtil = ContextUtil;
