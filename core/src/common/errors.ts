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
