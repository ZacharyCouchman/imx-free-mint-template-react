import { passport } from "@imtbl/sdk";
import { ImmutableConfiguration } from "@imtbl/sdk/x";
import {
  applicationEnvironment,
  immutablePublishableKey,
  passportClientId,
  passportRedirectUri,
  passportLogoutRedirectUri
} from "./config";

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


// Helper Functions
export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}