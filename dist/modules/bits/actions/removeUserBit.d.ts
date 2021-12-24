export declare function removeUserBits({ userIdentifier, bitId }: {
    userIdentifier: string;
    bitId: string;
}): Promise<import("../services/UsersBitsService").DeletedUserBit[]>;
