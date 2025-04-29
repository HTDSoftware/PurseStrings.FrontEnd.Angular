export const baseEnvironment = {
  msalConfig: {
    auth: {
      clientId: 'ENTER_CLIENT_ID',
      authority: 'ENTER_AUTHORITY',
      redirectUri: 'ENTER_REDIRECTURI',
      postLogoutRedirectUri: 'ENTER_POSTLOGOUTREDIRECTURI',
    },
  },
  apiConfig: {
    scopes: ['ENTER_SCOPE'],
    uri: 'ENTER_URI',
  },
  logging: {
    logFileName: 'app.log',
    maxFileSize: 1048576, // 1 MB
    maxFiles: 5,
  },
};

