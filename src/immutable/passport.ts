import { passport } from "@imtbl/sdk";
import { ImmutableConfiguration } from "@imtbl/sdk/x";
import {
  applicationEnvironment,
  immutablePublishableKey,
  passportClientId,
  passportRedirectUri,
  passportLogoutRedirectUri
} from "../config/config";

// Create Passport instance once
export const passportInstance = new passport.Passport({
  baseConfig: new ImmutableConfiguration({
    environment: applicationEnvironment,
    publishableKey: immutablePublishableKey
  }),
  clientId: passportClientId,
  redirectUri: passportRedirectUri,
  logoutRedirectUri: passportLogoutRedirectUri,
  audience: 'platform_api',
  scope: 'openid offline_access email transact',
});
