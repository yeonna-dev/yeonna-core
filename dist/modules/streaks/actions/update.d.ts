export declare function update({ count, increment, decrement, userIdentifier, discordGuildId, twitchChannelId, }: {
    count?: number;
    increment?: boolean;
    decrement?: boolean;
    userIdentifier: string;
    discordGuildId?: string;
    twitchChannelId?: string;
}): Promise<{
    previous: import("../services/StreakService").Streak | undefined;
    current: import("../services/StreakService").Streak;
} | undefined>;
//# sourceMappingURL=update.d.ts.map