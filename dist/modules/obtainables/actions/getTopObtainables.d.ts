import { ContextParameters } from '../../../common/types';
declare type GetTopObtainablesParameters = ContextParameters & {
    count: number;
    isCollectible?: boolean;
};
declare type TopObtainables = {
    userId: string;
    discordId?: string;
    twitchId?: string;
    amount: number;
};
export declare const getTopObtainables: ({ count, isCollectible, ...contextParameters }: GetTopObtainablesParameters) => Promise<TopObtainables[] | undefined>;
export declare const getTopPoints: (parameters: Omit<GetTopObtainablesParameters, 'isCollectible'>) => Promise<TopObtainables[] | undefined>;
export declare const getTopCollectibles: (parameters: Omit<GetTopObtainablesParameters, 'isCollectible'>) => Promise<TopObtainables[] | undefined>;
export {};
//# sourceMappingURL=getTopObtainables.d.ts.map