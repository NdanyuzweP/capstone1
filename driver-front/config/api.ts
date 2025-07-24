import { Platform } from 'react-native';

// API Configuration for Driver App
export const API_CONFIG = {
  // Backend API URL - using localhost for local development
  BASE_URL: Platform.select({
    ios: 'http://localhost:3001/api',
    android: 'http://10.0.2.2:3001/api', // Android emulator uses 10.0.2.2 for localhost
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
  // Use localhost for development
  if (__DEV__) {
    return Platform.select({
      ios: 'http://localhost:3001/api',
      android: 'http://10.0.2.2:3001/api', // Android emulator uses 10.0.2.2 for localhost
      web: 'http://localhost:3001/api',
      default: 'http://localhost:3001/api',
    });
  }
  
  // Use production URL for production builds
  return 'https://capstone1-60ax.onrender.com/api';
};