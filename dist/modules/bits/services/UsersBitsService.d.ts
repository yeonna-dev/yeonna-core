import { TimestampedRecord } from '../../../common/DB';
import { BitsFields } from './BitsService';
export declare enum UsersBitsFields {
    user_id = "user_id",
    bit_id = "bit_id",
    tag_ids = "tag_ids"
}
export interface UserBitRecord extends TimestampedRecord {
    [UsersBitsFields.user_id]: string;
    [UsersBitsFields.bit_id]: string;
    [UsersBitsFields.tag_ids]?: string;
    [BitsFields.content]?: string;
}
export interface UserBit {
    user: {
        id: string;
    };
    bit: {
        id: string;
        content?: string;
    };
    tags?: {
        id: string;
        name?: string;
    }[];
}
export interface DeletedUserBit {
    userId: string;
    bitId: string;
}
export declare class UsersBitsService {
    static find({ userIds, bitIds, search, }: {
        userIds?: string[];
        bitIds?: string[];
        search?: string;
    }): Promise<UserBit[]>;
    static create(usersBitsData: {
        userId: string;
        bitId: string;
        tagIds: string[];
    }[]): Promise<UserBit[]>;
    static remove({ userId, bitId, }: {
        userId: string;
        bitId: string;
    }): Promise<DeletedUserBit[]>;
    static addTags({ userId, bitId, tagIds, }: {
        userId: string;
        bitId: string;
        tagIds: string[];
    }): Promise<UserBit[]>;
    static serialize(userBitRecord: UserBitRecord): UserBit;
}
//# sourceMappingURL=UsersBitsService.d.ts.map