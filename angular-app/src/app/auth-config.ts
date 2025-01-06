import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../environments/env';
export const msalConfig = {
  auth: {
    clientId: environment.AZURE_AD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${environment.AZURE_TENANT_ID}`,
    redirectUri: environment.AZURE_REDIRECT_URL, // Adjust for production
  },
};

export const loginRequest = {
  scopes: ['user.read'],
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const msalGuardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Redirect,
  authRequest: loginRequest,
};

export const msalInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,
 protectedResourceMap: new Map([
  [
    `https://${environment.AZURE_KEY_VAULT_NAME}.vault.azure.net`,
    ['https://vault.azure.net/.default'],
  ],
]),
};
