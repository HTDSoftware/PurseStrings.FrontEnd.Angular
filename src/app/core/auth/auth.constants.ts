export const b2cPolicies = {
  names: {
    signUpSignIn: "b2c_1_pursestrings-signupsignin",
    editProfile: "b2c_1_pursestrings-editprofile",
    passReset: "b2c_1_pursestrings-passreset",
  },
  authorities: {
    signUpSignIn: {
      authority: "https://htdsoftwareb2c.b2clogin.com/htdsoftwareb2c.onmicrosoft.com/b2c_1_pursestrings-signupsignin",
    },
    editProfile: {
      authority: "https://htdsoftwareb2c.b2clogin.com/htdsoftwareb2c.onmicrosoft.com/b2c_1_pursestrings-updateprofile",
    },
    passReset: {
      authority: "https://htdsoftwareb2c.b2clogin.com/htdsoftwareb2c.onmicrosoft.com/b2c_1_pursestrings-passreset",
    },
  },
  authorityDomain: "htdsoftwareb2c.b2clogin.com",
};
