/**
 * Application Startup Configuration
 * Central configuration for application initialization
 */

export const APP_CONFIG = {
  // Application metadata
  APP_NAME: 'DMello',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Modern project management application',

  // Feature flags
  FEATURES: {
    DARK_MODE: false,
    NOTIFICATIONS: false,
    ANALYTICS: false,
    ERROR_REPORTING: false
  },

  // Default settings
  DEFAULTS: {
    LANGUAGE: 'en',
    TIMEZONE: 'UTC',
    DATE_FORMAT: 'MM/DD/YYYY',
    TIME_FORMAT: '12h'
  },

  // Logging configuration
  LOGGING: {
    ENABLED: true,
    LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
    MAX_LOGS: 100
  },

  // Performance settings
  PERFORMANCE: {
    ENABLE_AOT: true,
    ENABLE_PROD_MODE: false,
    LAZY_LOAD_MODULES: true
  }
};
