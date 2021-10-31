export declare enum ContextPlatforms {
    Discord = "discord",
    Twitch = "twitch"
}
declare class ContextUtilClass {
    createContext({ discordGuildID, twitchChannelID, }: {
        discordGuildID?: string;
        twitchChannelID?: string;
    }): string | undefined;
}
export declare const ContextUtil: ContextUtilClass;
export {};
