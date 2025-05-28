import { config } from 'dotenv';
import path from 'path';

// Load the root .env file (one directory up)
config({ path: path.resolve(__dirname, '../.env') });

export default {
  name: 'AANF Banking',
  extra: {
    apiUrl: process.env.EXPO_API_URL || 'http://192.168.1.3:8000',
    supportedCarriers: process.env.SUPPORTED_CARRIERS?.split(',') || ['Airtel', 'Jio', 'Vi', 'BSNL', 'Unknown'],
    devMode: process.env.DEV_MODE === 'true'
  }
};