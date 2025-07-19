import { Platform } from 'react-native';

// API Configuration for Driver App
export const API_CONFIG = {
  // Backend API URL - same as passenger app since it's the same backend
  BASE_URL: Platform.select({
    ios: 'https://capstone1-60ax.onrender.com/api',
    android: 'https://capstone1-60ax.onrender.com/api',
    web: 'https://capstone1-60ax.onrender.com/api',
    default: 'https://capstone1-60ax.onrender.com/api',
  }),
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Environment-specific configurations
export const getApiUrl = () => {
  // Always use production URL since backend is deployed
  return 'https://capstone1-60ax.onrender.com/api';
  
  // Original logic (commented out):
  // if (__DEV__) {
  //   return API_CONFIG.BASE_URL;
  // }
  // return 'https://capstone1-60ax.onrender.com/api';
};