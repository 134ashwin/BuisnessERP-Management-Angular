/**
 * Environment Configuration
 * Development environment settings
 */
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7098/api', //https://localhost:7098/api
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