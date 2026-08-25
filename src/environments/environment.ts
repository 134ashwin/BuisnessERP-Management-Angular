/**
 * Environment Configuration
 * Development environment settings
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  logging: {
    enableLogging: true,
    logLevel: 'debug'
  },
  features: {
    analytics: false,
    errorReporting: false
  }
};
