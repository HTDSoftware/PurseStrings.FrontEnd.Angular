export const environment = {
  production: true,
  apiEndpoint: 'https://your-production-api-url',
	msalConfig: {
    auth: {
      clientId: 'ENTER_CLIENT_ID',
      authority: 'ENTER_AUTHORITY',
      redirectUri: 'ENTER_REDIRECTURI',
      postLogoutRedirectUri: 'ENTER_POSTLOGOUTREDIRECTURI'
    }
  },
  apiConfig: {
    scopes: ['ENTER_SCOPE'],
    uri: 'ENTER_URI'
  }
};
