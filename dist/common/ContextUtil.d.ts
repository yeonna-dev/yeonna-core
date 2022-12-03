export declare enum ContextPlatform {
    Discord = "discord",
    Twitch = "twitch"
}
export declare class ContextUtil {
    static createContext({ discordGuildId, twitchChannelId, }: {
        discordGuildId?: string;
        twitchChannelId?: string;
    }): string | undefined;
}
//# sourceMappingURL=ContextUtil.d.ts.map