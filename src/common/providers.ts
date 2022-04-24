import { findOrCreateUser, findUser } from '../modules/users/actions';
import { ContextUtil } from './ContextUtil';
import { UserNotFound } from './errors';
import { Identifiers, UserAndContextProvider } from './types';

export const withUserAndContext = (identifiers: Identifiers): UserAndContextProvider =>
  async (callback, { createNonexistentUser } = {}) =>
  {
    const { userIdentifier, discordGuildId, twitchChannelId } = identifiers;

    let user;
    if(createNonexistentUser)
      user = await findOrCreateUser(identifiers);
    else
    {
      user = await findUser(userIdentifier);
      if(!user)
        throw new UserNotFound();
    }

    const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });
    return callback(user, context);
  };

