"use strict";
/* Users */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonPendingRoleRequest = exports.TagsNotFound = exports.NoBitContentProvided = exports.UserBitNotFound = exports.BitNotFound = exports.ItemNotFound = exports.NotEnoughCollectibles = exports.NotEnoughPoints = exports.UserNotFound = void 0;
class UserNotFound extends Error {
    constructor() {
        super('User not found');
    }
}
exports.UserNotFound = UserNotFound;
class NotEnoughPoints extends Error {
    constructor() {
        super('Not enough points');
    }
}
exports.NotEnoughPoints = NotEnoughPoints;
class NotEnoughCollectibles extends Error {
    constructor() {
        super('Not enough collectibles');
    }
}
exports.NotEnoughCollectibles = NotEnoughCollectibles;
/* Items */
class ItemNotFound extends Error {
    constructor() {
        super('Item not found');
    }
}
exports.ItemNotFound = ItemNotFound;
/* Bits */
class BitNotFound extends Error {
    constructor() {
        super('Bit not found');
    }
}
exports.BitNotFound = BitNotFound;
class UserBitNotFound extends Error {
    constructor() {
        super('Bit not found for user');
    }
}
exports.UserBitNotFound = UserBitNotFound;
class NoBitContentProvided extends Error {
    constructor() {
        super('No content provided');
    }
}
exports.NoBitContentProvided = NoBitContentProvided;
/* Tags */
class TagsNotFound extends Error {
    constructor() {
        super('Tags not found');
    }
}
exports.TagsNotFound = TagsNotFound;
/* Discord */
class NonPendingRoleRequest extends Error {
    constructor() {
        super('Role request is not pending');
    }
}
exports.NonPendingRoleRequest = NonPendingRoleRequest;
