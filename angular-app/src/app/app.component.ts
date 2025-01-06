import { Component } from '@angular/core';
import { KeyVaultService } from './keyvault.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], // Import CommonModule here
  template: `
    <h1>Secret Viewer</h1>
    <button (click)="fetchSecrets()" [disabled]="isLoading">
      {{ isLoading ? 'Loading...' : 'Get Secrets' }}
    </button>
    
    <!-- Display the token if it exists -->
    <div *ngIf="token">
      <h2>Access Token</h2>
      <p>{{ token }}</p>
    </div>

    <div *ngIf="secrets">
      <div *ngFor="let secret of secrets | keyvalue">
        <p><strong>{{ secret.key }}:</strong> {{ secret.value }}</p>
      </div>
    </div>
  `,
})
export class AppComponent {
  secrets: { [key: string]: string } | null = null;
  isLoading: boolean = false;  // Track loading state
  token: string | null = null;  // Store the token

  constructor(private keyVaultService: KeyVaultService) {}

  async fetchSecrets() {
    this.isLoading = true;  // Set loading state to true
    this.token = await this.keyVaultService.getToken();  // Get the token from the service
    this.secrets = await this.keyVaultService.getSecrets();
    this.isLoading = false;  // Set loading state to false once data is fetched
  }
}
