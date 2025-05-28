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
    console.log(`🔐 [SIM] Deriving KAF for function: ${functionId}`);
    
    // Get AKMA key from secure storage - we'll need to use this for server communication
    const akmaKey = await SecureStore.getItemAsync('akma-key');
    
    if (!akmaKey) {
        console.log("❌ [SIM] No AKMA key found, cannot derive KAF");
        // Instead of throwing error, provide fallback for testing
        if (__DEV__) {
            console.log("⚠️ [SIM] DEV MODE: Using fallback key for development");
            // Return development fallback so app doesn't crash
            return "fallback-dev-kaf-do-not-use-in-production";
        }
        throw new Error("Authentication required");
    }
    
    try {
        // Check for existing KAF for this function
        const existingKaf = await SecureStore.getItemAsync(`kaf-${functionId}`);
        
        // Instead of deriving locally, get the KAF expiry from secure storage
        const kafExpiry = await SecureStore.getItemAsync('kaf-expiry');
        const now = Math.floor(Date.now() / 1000);
        
        // Only fetch new KAF if necessary - check if we have valid KAF that's not expired
        if (!existingKaf || !kafExpiry || now > parseInt(kafExpiry)) {
            console.log(`🔄 [SIM] Deriving new KAF for function: ${functionId}`);
            
            // For demo purposes, derive KAF based on AKMA key
            // In production, this would be securely derived through the SIM
            const afid = functionId || 'transactions';
            
            // Debug info - just print the first 8 chars of the kakma key
            const kakmaPartial = akmaKey.substring(0, 8) + "...";
            console.log(`🔑 [SIM] Using AKMA key: ${kakmaPartial} with function: ${afid}`);
            
            // Use the same derivation method as the backend
            const message = `${akmaKey}${afid}AANF Banking App KAF Derivation`;
            const kaf = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                message
            );
            
            console.log(`🔑 [SIM] KAF derived: ${kaf.substring(0, 8)}...`);
            await SecureStore.setItemAsync(`kaf-${afid}`, kaf);
            
            return kaf;
        } else {
            console.log(`✅ [SIM] Using existing valid KAF for ${functionId}`);
            console.log(`⏱️ [SIM] KAF expires at: ${new Date(parseInt(kafExpiry) * 1000).toLocaleString()}`);
            return existingKaf;
        }
    } catch (error) {
        console.error(`❌ [SIM] KAF derivation error: ${error.message}`);
        throw error;
    }
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

// Simulate primary authentication process
export const simulatePrimaryAuthentication = async () => {
    console.log("🔐 [SIM] Simulating primary authentication...");
    
    // Get device identifier first - we need this for Ki derivation
    const deviceId = await getDeviceIdentifier();
    console.log(`📱 [SIM] Using device ID: ${deviceId}`);
    
    // Generate a challenge
    const challenge = await Crypto.getRandomBytesAsync(16).then(bytes =>
        Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
    );
    console.log(`📡 [SIM] Generated challenge: ${challenge.substring(0, 8)}...`);
    
    // Get Ki - for the demo this should be deterministic based on deviceId and challenge
    // to ensure the backend can verify it
    const ki = await getKi();
    console.log(`🔑 [SIM] Using Ki: ${ki.substring(0, 8)}...`);
    
    // Compute response using SHA-256 (same as backend)
    const response = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${ki}:${challenge}`
    );
    console.log(`📡 [SIM] Generated response: ${response.substring(0, 8)}...`);
    
    return { challenge, response };
};