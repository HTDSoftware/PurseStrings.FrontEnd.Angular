import { baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,
  production: true,
  apiEndpoint: 'https://your-production-api-url',
  msalConfig: {
    ...baseEnvironment.msalConfig,
    auth: {
      clientId: 'ENTER_CLIENT_ID',
      authority: 'ENTER_AUTHORITY',
      redirectUri: 'ENTER_REDIRECTURI',
      postLogoutRedirectUri: 'ENTER_POSTLOGOUTREDIRECTURI',
    },
  },
  apiConfig: {
    ...baseEnvironment.apiConfig,
    scopes: ['ENTER_SCOPE'],
    uri: 'ENTER_URI',
  },
};

