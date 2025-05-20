import 'dotenv/config'

export default {
  name: 'AANF Banking',
  extra: {
    apiUrl: process.env.EXPO_API_URL || 'http://10.3.184.11:8000',
    supportedCarriers: process.env.SUPPORTED_CARRIERS?.split(',') || ['Airtel', 'Jio', 'Vi', 'BSNL', 'Unknown'],
    devMode: process.env.DEV_MODE === 'true'
  }
};