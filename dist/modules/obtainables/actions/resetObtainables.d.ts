import { ContextParameters } from '../../../common/types';
import { Obtainable } from '../services/ObtainableService';
declare type ResetObtainablesParameters = ContextParameters & {
    isCollectible?: boolean;
};
export declare const resetObtainables: ({ isCollectible, ...identifiers }: ResetObtainablesParameters) => Promise<Obtainable[] | undefined>;
export declare const resetPoints: (parameters: Omit<ResetObtainablesParameters, 'isCollectible'>) => Promise<Obtainable[] | undefined>;
export declare const resetCollectibles: (parameters: Omit<ResetObtainablesParameters, 'isCollectible'>) => Promise<Obtainable[] | undefined>;
export {};
//# sourceMappingURL=resetObtainables.d.ts.map