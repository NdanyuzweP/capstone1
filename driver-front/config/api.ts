import { Platform } from 'react-native';

// API Configuration for Driver App
export const API_CONFIG = {
  // Backend API URL - same as passenger app since it's the same backend
  BASE_URL: Platform.select({
    ios: 'http://localhost:3001/api',
    android: 'http://10.0.2.2:3001/api', // Android emulator localhost
    web: 'http://localhost:3001/api',
    default: 'http://localhost:3001/api',
  }),
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Environment-specific configurations
export const getApiUrl = () => {
  // Always use production URL for now since backend is deployed
  // You can change this back to __DEV__ logic when you want to run local backend
  return 'http://localhost:5001/api';
  
  // Original logic (commented out):
  // if (__DEV__) {
  //   return API_CONFIG.BASE_URL;
  // }
  // return 'https://capstone1-60ax.onrender.com/api';
};