import { findOrCreateUser, findUser } from '../modules/users/actions';
import { ContextUtil } from './ContextUtil';
import { UserNotFound } from './errors';
import { ContextParameters, ContextProvider, Identifiers, UserAndContextProvider } from './types';

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
      if(!silentErrors && !user)
        throw new UserNotFound();
    }

    const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });
    return callback(user, context);
  }
);
