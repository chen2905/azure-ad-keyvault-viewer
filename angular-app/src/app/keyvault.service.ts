import { Injectable } from '@angular/core';
import axios from 'axios';
import { msalInstance } from './auth-config';  // Import the msalInstance from your config
import { AuthenticationResult } from '@azure/msal-browser';
import { environment } from '../environments/env';

@Injectable({
  providedIn: 'root',
})
export class KeyVaultService {
  private apiUrl: string = `${environment.KEYVAULT_VIEWER_API}Secrets`;

  constructor() {}

  async getSecrets(): Promise<any> {
    const token = await this.getToken();  // Get the token using MSAL
    const url = this.apiUrl;  // API URL for retrieving secrets
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;  // Returning all secrets retrieved from the API
  }

   async getToken(): Promise<string> {
    const request = {
      scopes: [`https://${environment.AZURE_KEY_VAULT_NAME}.vault.azure.net/.default`], // Ensure proper scope for Azure Key Vault
    };

    try {
      const account = msalInstance.getAllAccounts()[0]; // Get the current user account

      const response = await msalInstance.acquireTokenSilent({
        account,
        scopes: [`https://${environment.AZURE_KEY_VAULT_NAME}.vault.azure.net/.default`], // Ensure proper scope for Azure Key Vault
      });

     // const response: AuthenticationResult = await msalInstance.acquireTokenSilent(request); // Using msalInstance
      return response.accessToken;  // Return the access token
    } catch (error) {
      // If silent token acquisition fails, fallback to the popup flow
      const response: AuthenticationResult = await msalInstance.acquireTokenPopup(request);
      return response.accessToken;  // Return the access token from the popup flow
    }
  }
}
