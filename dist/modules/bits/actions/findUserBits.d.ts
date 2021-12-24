export declare function findUserBits({ userIdentifier, search, }: {
    userIdentifier: string;
    search?: string;
}): Promise<import("../services/UsersBitsService").UserBit[]>;
