/**
 * Environment Configuration
 * Production environment settings
 */
export const environment = {
  production: true,
  apiUrl: 'https://your-api-app-service.azurewebsites.net/api',
  apiTimeout: 30000,
  logging: {
    enableLogging: false,
    logLevel: 'error'
  },
  features: {
    analytics: true,
    errorReporting: true
  }
};
