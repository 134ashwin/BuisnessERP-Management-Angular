/**
 * HTTP Configuration
 * Central configuration for HTTP client setup and timeouts
 */

export const HTTP_CONFIG = {
  // Timeout for HTTP requests (milliseconds)
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // milliseconds
    BACKOFF_MULTIPLIER: 2
  },

  // Request headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  // Cache configuration
  CACHE: {
    ENABLED: true,
    DURATION: 5 * 60 * 1000 // 5 minutes in milliseconds
  }
};

export const API_CONFIG = {
  // Base URL - should be set based on environment
  BASE_URL: '/api',

  // API versioning
  VERSION: 'v1',

  // Request/Response interceptor settings
  INTERCEPTORS: {
    ENABLE_ERROR_HANDLER: true,
    ENABLE_LOGGING: true,
    ENABLE_CACHING: true
  },

  // Timeouts for different endpoint types
  TIMEOUTS: {
    DEFAULT: 30000,
    UPLOAD: 60000,
    DOWNLOAD: 60000
  }
};
