export declare function removeUserBits({ userIdentifier, bitID }: {
    userIdentifier: string;
    bitID: string;
}): Promise<{
    userID: any;
    bitID: any;
}[]>;
