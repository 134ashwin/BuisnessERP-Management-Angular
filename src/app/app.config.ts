import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { HttpRequestInterceptor } from './core/interceptors/http-request.interceptor';
import { apiInterceptor } from './core/interceptors/api.interceptor';

/**
 * Application Configuration
 * Central configuration for all providers, interceptors, and feature modules
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiInterceptor])
    ),
    
    // HTTP Interceptors - order matters!
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

    // TODO: Add additional providers as needed:
    // - State management (NgRx, Akita, etc.)
    // - Animation configuration
    // - Date/Time configuration
    // - Custom error handlers
  ]
};
