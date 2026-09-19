/**
 * Environment Configuration
 * Production environment settings
 */
export const environment = {
  production: true,
  apiUrl: 'https://dmellobuisnessportal-gtf0fscqh8grbwdb.westus3-01.azurewebsites.net/api',
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
