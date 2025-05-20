import axios from 'axios';
import Constants from 'expo-constants';

// Get API URL from environment or use a default for development
export const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 
                       (__DEV__ ? 'https://ec43-2409-40f4-40cd-c746-78f5-eeaa-4d86-f725.ngrok-free.app' : 'https://api.aanfbanking.com');

// API endpoints for traditional authentication flow
export const login = (data) => axios.post(`${BASE_URL}/traditional/login`, data);
export const verifyOTP = (data) => axios.post(`${BASE_URL}/traditional/verify-otp`, data);
export const traditionalTransaction = (data, token) =>
  axios.post(`${BASE_URL}/traditional/transaction`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// First, create a debug helper:

const logApi = (method, endpoint, data = null, response = null) => {
  if (__DEV__) {
    if (!response) {
      console.log(`📡 [API] ${method} ${endpoint}`);
      if (data) console.log(`📦 [API] Request data:`, data);
    } else {
      console.log(`✅ [API] ${method} ${endpoint} - Status: ${response.status}`);
      console.log(`📦 [API] Response data:`, response.data);
    }
  }
};

// Then update API functions to log requests and responses:

export const authenticateAANF = async (deviceInfo = {}) => {
  logApi('POST', `${BASE_URL}/aanf/authenticate`, deviceInfo);
  try {
    const response = await axios.post(`${BASE_URL}/aanf/authenticate`, deviceInfo);
    logApi('POST', `${BASE_URL}/aanf/authenticate`, null, response);
    return response;
  } catch (error) {
    console.error(`❌ [API] POST ${BASE_URL}/aanf/authenticate failed:`, error.message);
    throw error;
  }
};

export const createAANFSession = async (functionId, akmaKey) => {
  const data = { function_id: functionId };
  const headers = { 'x-akma-key': akmaKey };
  
  logApi('POST', `${BASE_URL}/aanf/create-session`, 
    { data, headers: { 'x-akma-key': akmaKey.substring(0, 8) + '...' } });
  
  try {
    const response = await axios.post(
      `${BASE_URL}/aanf/create-session`, 
      data,
      { headers }
    );
    logApi('POST', `${BASE_URL}/aanf/create-session`, null, response);
    return response;
  } catch (error) {
    console.error(`❌ [API] POST ${BASE_URL}/aanf/create-session failed:`, error.message);
    throw error;
  }
};

export const aanfTransaction = async (data, akmaKey, signature = null) => {
  const headers = { 'x-akma-key': akmaKey };
  if (signature) {
    headers['x-transaction-sig'] = signature;
  }
  
  logApi('POST', `${BASE_URL}/aanf/transaction`, 
    { data, headers: { 
      'x-akma-key': akmaKey.substring(0, 8) + '...',
      'x-transaction-sig': signature ? (signature.substring(0, 8) + '...') : 'None'
    }});
  
  try {
    const response = await axios.post(`${BASE_URL}/aanf/transaction`, data, { headers });
    logApi('POST', `${BASE_URL}/aanf/transaction`, null, response);
    return response;
  } catch (error) {
    console.error(`❌ [API] POST ${BASE_URL}/aanf/transaction failed:`, error.message);
    throw error;
  }
};

export const logoutAANF = (akmaKey) =>
  axios.post(`${BASE_URL}/aanf/logout`, {}, {
    headers: { 'x-akma-key': akmaKey }
  });
