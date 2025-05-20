import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';

const logSim = (message, data = null) => {
  if (__DEV__) {
    console.log(`🔐 [SIM] ${message}`, data ? data : '');
  }
};

// Simulate SIM device identity
export const getDeviceIdentifier = async () => {
  logSim('Getting device identifier...');
  const deviceId = Device.modelId || Device.deviceName || 'unknown';
  logSim(`Raw device ID: ${deviceId}`);
  
  const hashedDeviceId = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    deviceId
  );
  logSim(`Generated device identifier: ${hashedDeviceId.substring(0, 8)}...`);
  return hashedDeviceId.substring(0, 16); // Truncate for key usage
};

// K_i simulation - Normally stored securely in SIM
export const getKi = async () => {
  logSim('Retrieving simulated Ki...');
  let ki = await SecureStore.getItemAsync('sim-ki');
  
  if (!ki) {
    logSim('No Ki found, generating new one...');
    // Generate a simulated K_i value first time
    ki = await Crypto.getRandomBytesAsync(32).then(bytes => 
      Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''));
    await SecureStore.setItemAsync('sim-ki', ki);
    logSim(`New Ki generated: ${ki.substring(0, 8)}...`);
  } else {
    logSim(`Retrieved existing Ki: ${ki.substring(0, 8)}...`);
  }
  
  return ki;
};

// Derive KAKMA (Authentication Key) from K_i
export const deriveKAKMA = async () => {
  const ki = await getKi();
  const deviceId = await getDeviceIdentifier();
  
  const kakma = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${ki}:${deviceId}:kakma`
  );
  
  await SecureStore.setItemAsync('kakma-key', kakma);
  return kakma;
};

// Generate AKID (Authentication Key ID)
export const generateAKID = async () => {
  const kakma = await deriveKAKMA();
  const akid = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${kakma}:id:${Date.now()}`
  );
  
  await SecureStore.setItemAsync('akid', akid.substring(0, 16));
  return akid.substring(0, 16); // Use first 16 chars as ID
};

// Derive K_AF (Application Function Key) for a specific function
export const deriveKAF = async (functionId) => {
  const kakma = await SecureStore.getItemAsync('kakma-key') || await deriveKAKMA();
  const afid = functionId || 'transactions'; // Default function ID
  
  const kaf = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${kakma}:${afid}`
  );
  
  await SecureStore.setItemAsync(`kaf-${afid}`, kaf);
  return kaf;
};

// Encrypt transaction data with K_AF
export const encryptTransaction = async (data) => {
  const kaf = await deriveKAF('transactions');
  const dataString = JSON.stringify(data);
  
  // In a real implementation, this would use actual encryption
  // Here we just create an HMAC to verify integrity
  const hmac = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${kaf}:${dataString}`
  );
  
  return {
    data: dataString,
    hmac,
    timestamp: Date.now()
  };
};

// Verify and decrypt transaction data
export const verifyTransaction = async (encryptedData) => {
  const kaf = await deriveKAF('transactions');
  const { data, hmac } = encryptedData;
  
  const calculatedHmac = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${kaf}:${data}`
  );
  
  if (calculatedHmac !== hmac) {
    throw new Error('Transaction data integrity verification failed');
  }
  
  return JSON.parse(data);
};