/**
 * Application Constants
 * Centralized location for all application-wide constants
 */

export const APP_CONSTANTS = {
  APP_NAME: 'DMello',
  APP_VERSION: '1.0.0',
  API_TIMEOUT: 30000,
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme'
  },
  ROUTES: {
    AUTH: '/auth',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    DASHBOARD: '/dashboard',
    HOME: '/'
  },
  MESSAGES: {
    LOADING: 'Loading...',
    ERROR: 'An error occurred',
    SUCCESS: 'Operation successful',
    VALIDATION_ERROR: 'Please fix the errors below'
  }
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    REFRESH_TOKEN: '/api/auth/refresh-token'
  },
  USERS: {
    GET_PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    CHANGE_PASSWORD: '/api/users/change-password'
  }
};
