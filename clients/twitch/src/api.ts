import { ApiClient, ClientCredentialsAuthProvider } from 'twitch';

/* Initialize the API client */
const clientID = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
if(! clientID || ! clientSecret)
  throw new Error('Please provide the Twitch client ID and secret in the .env file');

const authProvider = new ClientCredentialsAuthProvider(clientID, clientSecret);
const apiClient = new ApiClient({ authProvider });

/* Initalize the API instance. */
export class API
{
  static async getUsersByNames(usernames: string[])
  {
    const users = await apiClient.helix.users.getUsersByNames(usernames);
    return users.length === 0 ? [] : users;
  }

  static async getUserByName(username: string)
  {
    const [ user ] = await API.getUsersByNames([ username ]);
    return user;
  }
}
