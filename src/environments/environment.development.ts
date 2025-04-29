import { baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,
  production: false,
  apiEndpoint: 'https://localhost:7200',
  msalConfig: {
    ...baseEnvironment.msalConfig,
    auth: {
      clientId: '6515bff9-5da1-4fa6-8931-cdab04034931',
      authority: 'https://htdsoftwareb2c.b2clogin.com/htdsoftwareb2c.onmicrosoft.com/B2C_1_pursestrings-signupsignin/oauth2/v2.0/authorize',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'https://localhost:4200/logout',
    },
  },
  apiConfig: {
    ...baseEnvironment.apiConfig,
    scopes: ['https://htdsoftwareb2c.onmicrosoft.com/api/read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};

