import { TimestampedRecord } from '../../../common/DB';
export declare enum TagsFields {
    id = "id",
    name = "name"
}
export interface TagRecord extends TimestampedRecord {
    id: string;
    name: string;
}
export interface Tag {
    id: string;
    name: string;
}
export declare class TagsService {
    static tableName: string;
    static find({ ids, search, names, }: {
        ids?: string | string[];
        search?: string;
        names?: string[];
    }): Promise<Tag[]>;
    static create(names: string | string[]): Promise<Tag[]>;
    static remove(names: string | string[]): Promise<Tag[]>;
    static serialize(tagRecord: TagRecord): Tag;
}
