/**
 * Environment Configuration
 * Development environment settings
 */
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7098/api/', //http://localhost:3000/api old working Url.
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
