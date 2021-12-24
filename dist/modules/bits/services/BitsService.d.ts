import { TimestampedRecord } from '../../../common/DB';
export declare enum BitsFields {
    id = "id",
    content = "content"
}
export interface BitRecord extends TimestampedRecord {
    id: string;
    content: string;
}
export interface Bit {
    id: string;
    content: string;
}
export declare class BitsService {
    static table: string;
    static find({ ids, search, content, }: {
        ids?: string | string[];
        search?: string;
        content?: string;
    }): Promise<Bit[]>;
    static create(content: string | string[]): Promise<Bit[]>;
    static serialize(bitRecord: BitRecord): Bit;
}
