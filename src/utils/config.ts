import { Environment } from "@imtbl/sdk/x";

export const applicationEnvironment = Environment.SANDBOX;

export const immutablePublishableKey: string = import.meta.env.VITE_IMMUTABLE_PUBLISHABLE_KEY;

export const passportClientId: string = import.meta.env.VITE_PASSPORT_CLIENT_ID;
export const passportRedirectUri: string = import.meta.env.VITE_PASSPORT_LOGIN_REDIRECT_URI;
export const passportLogoutRedirectUri: string = import.meta.env.VITE_PASSPORT_LOGOUT_REDIRECT_URI;
