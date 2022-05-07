import { Identifiers } from '../../../common/types';
declare type UpdateObtainablesParameters = Identifiers & {
    amount: number;
    isCollectible?: boolean;
    add?: boolean;
    subtract?: boolean;
};
export declare const updateObtainables: ({ amount, isCollectible, add, subtract, ...identifiers }: UpdateObtainablesParameters) => Promise<number | undefined>;
export declare const updatePoints: (parameters: Omit<UpdateObtainablesParameters, 'isCollectible'>) => Promise<number | undefined>;
export declare const updateCollectibles: (parameters: Omit<UpdateObtainablesParameters, 'isCollectible'>) => Promise<number | undefined>;
export {};
//# sourceMappingURL=updateObtainables.d.ts.map