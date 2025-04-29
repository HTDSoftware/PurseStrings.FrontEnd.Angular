import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { b2cPolicies } from './auth.constants';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const msalConfig: Configuration = {
  auth: {
    clientId: '124c4a82-b871-4b47-80b9-316c4e0b23bb',
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: '/',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: isIE,
  },
  system: {
    loggerOptions: {
      loggerCallback: (logLevel, message, containsPii) => {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false,
    },
  },
};

export const protectedResources = {
  pursestringsApi: {
    endpoint: "http://localhost:7200", // Update this to your production API URL as needed
    scopes: {
      read: ["https://htdsoftwareb2c.onmicrosoft.com/pursestrings-webapi/pursestrings-webapi.read"],
      write: ["https://htdsoftwareb2c.onmicrosoft.com/pursestrings-webapi/pursestrings-webapi.write"],
      readwrite: ["https://htdsoftwareb2c.onmicrosoft.com/pursestrings-webapi/pursestrings-webapi.readwrite"],
    },
  },
};
