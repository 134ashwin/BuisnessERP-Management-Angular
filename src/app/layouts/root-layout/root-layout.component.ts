/**
 * Root Layout Component
 * Wrapper component for the entire application
 * Handles global navigation, error handling, and layout management
 */

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-root">
      <!-- Global Header (if needed) -->
      <!-- <app-header></app-header> -->

      <!-- Main Content -->
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <!-- Global Footer (if needed) -->
      <!-- <app-footer></app-footer> -->

      <!-- Global Error/Toast Notifications (if needed) -->
      <!-- <app-notifications></app-notifications> -->
    </div>
  `,
  styles: [`
    .app-root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class RootLayoutComponent implements OnInit {
  ngOnInit(): void {
    // Initialize global application settings
    // Configure theme, language, etc.
  }
}
