import 'dotenv/config'

export default {
  name: 'AANF Banking',
  extra: {
    apiUrl: process.env.EXPO_API_URL || 'https://ec43-2409-40f4-40cd-c746-78f5-eeaa-4d86-f725.ngrok-free.app',
    supportedCarriers: process.env.SUPPORTED_CARRIERS?.split(',') || ['Airtel', 'Jio', 'Vi', 'BSNL', 'Unknown'],
    devMode: process.env.DEV_MODE === 'true'
  }
};