import { findOrCreateUser, findUser } from '../modules/users/actions';
import { ContextUtil } from './ContextUtil';
import { UserNotFound } from './errors';
import
{
  ContextParameters,
  ContextProvider,
  Identifiers,
  UserAndContextProvider,
  UserProvider
} from './types';

export const withUser = (identifiers: Identifiers): UserProvider => (
  async (callback, options) =>
  {
    const { createNonexistentUser, silentErrors } = options || {};

    let user;
    if(createNonexistentUser)
      user = await findOrCreateUser(identifiers);
    else
    {
      user = await findUser(identifiers.userIdentifier);
      if(!silentErrors && !user)
        throw new UserNotFound();
    }

    return callback(user);
  }
);

export const withContext = (contextParameters: ContextParameters): ContextProvider => (
  async (callback, options) =>
  {
    const { requireContextParameters } = options || {};
    const { discordGuildId, twitchChannelId } = contextParameters;

    if(requireContextParameters && !discordGuildId && !twitchChannelId)
      throw new Error('No Discord Guild ID or Twitch Channel ID provided');

    const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });
    return callback(context);
  }
);

export const withUserAndContext = (identifiers: Identifiers): UserAndContextProvider => (
  async (callback, options) =>
  {
    const {
      createNonexistentUser,
      requireContextParameters,
      silentErrors,
    } = options || {};

    const { userIdentifier, discordGuildId, twitchChannelId } = identifiers;

    if(requireContextParameters && !discordGuildId && !twitchChannelId)
      throw new Error('No Discord Guild ID or Twitch Channel ID provided');

    let user;
    if(createNonexistentUser)
      user = await findOrCreateUser(identifiers);
    else
    {
      user = await findUser(userIdentifier);
      if(!user)
      {
        if(!silentErrors)
          throw new UserNotFound();

        return;
      }
    }

    const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });
    return callback(user, context);
  }
);
