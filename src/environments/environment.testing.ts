import { baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,
  production: false,
  apiEndpoint: 'https://localhost:7200',
  msalConfig: {
    ...baseEnvironment.msalConfig,
    auth: {
      clientId: 'ec057dcf-bdb1-4740-91f0-9c6d1c7e6e2d',
      authority: 'https://htdsoftwareb2c.b2clogin.com/htdsoftwareb2c.onmicrosoft.com/B2C_1_signupsignin',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200',
    },
  },
  apiConfig: {
    ...baseEnvironment.apiConfig,
    scopes: ['https://htdsoftwareb2c.onmicrosoft.com/api/read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};

