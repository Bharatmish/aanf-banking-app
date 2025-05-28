import Constants from 'expo-constants';

// App configuration
export const APP_CONFIG = {
  // API configuration
  api: {
    baseUrl: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000',
    timeout: 10000, // 10 seconds
  },
  
  // Authentication configuration
  auth: {
    tokenExpiry: 3600, // 1 hour
    storageKeys: {
      traditional: 'traditional-token',
      aanfKey: 'akma-key',
      aanfKaf: 'kaf-transactions',
    }
  },
  
  // Feature flags
  features: {
    isTestMode: __DEV__,
    enableDetailedLogs: __DEV__,
  }
};

// Helper for consistent logging
export const log = (message, data = null) => {
  if (APP_CONFIG.features.enableDetailedLogs) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};