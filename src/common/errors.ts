/* Users */

export class UserNotFound extends Error
{
  constructor()
  {
    super('User not found');
  }
}

export class NotEnoughPoints extends Error
{
  constructor()
  {
    super('Not enough points');
  }
}

export class NotEnoughCollectibles extends Error
{
  constructor()
  {
    super('Not enough collectibles');
  }
}

/* Items */

export class ItemNotFound extends Error
{
  constructor()
  {
    super('Item not found');
  }
}

/* Bits */

export class BitNotFound extends Error
{
  constructor()
  {
    super('Bit not found');
  }
}

export class UserBitNotFound extends Error
{
  constructor()
  {
    super('Bit not found for user');
  }
}

export class NoBitContentProvided extends Error
{
  constructor()
  {
    super('No content provided');
  }
}

/* Tags */

export class TagsNotFound extends Error
{
  constructor()
  {
    super('Tags not found');
  }
}

/* Discord */

export class NonPendingRoleRequest extends Error
{
  constructor()
  {
    super('Role request is not pending');
  }
}
