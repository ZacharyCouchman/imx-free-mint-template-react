import { passport } from "@imtbl/sdk";
import { ImmutableConfiguration } from "@imtbl/sdk/x";
import config, { applicationEnvironment } from "../config/config"; // Create Passport instance once

export const passportInstance = new passport.Passport({
  baseConfig: new ImmutableConfiguration({ environment: applicationEnvironment, publishableKey: config[applicationEnvironment].immutablePublishableKey }),
  clientId: config[applicationEnvironment].passportClientId,
  redirectUri: config[applicationEnvironment].passportRedirectUri,
  logoutRedirectUri: config[applicationEnvironment].passportLogoutRedirectUri,
  audience: "platform_api",
  scope: "openid offline_access email transact",
});

export const zkEVMProvider = passportInstance.connectEvm({ announceProvider: true });
