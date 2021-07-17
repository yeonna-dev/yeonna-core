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
