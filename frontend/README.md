# AANF Banking App Frontend

React Native mobile application demonstrating secure banking with multiple authentication methods.

## Technology Stack

- React Native with Expo
- React Navigation for routing
- React Native Paper for UI components
- Expo SecureStore for secure storage
- Axios for API communication
- CryptoJS for transaction signing

## Features

- **Dual Authentication Flows**:
  - Traditional: Username/password + OTP verification
  - AANF: SIM-based authentication with crypto signatures
- **Transaction Processing**
- **Transaction History** with integrity verification
- **Secure Storage** for sensitive tokens and keys

## Project Structure

```
frontend/
├── App.js                 # Root component
├── app.config.js          # Expo configuration
├── package.json           # Dependencies
├── assets/                # Images and animation files
├── components/            # Reusable UI components
├── navigation/            # Navigation configuration
├── screens/               # App screens
├── services/              # API services
└── utils/                 # Helper functions
    ├── config.js          # App configuration
    ├── secureTransactions.js # Transaction handling
    ├── sim.js             # SIM authentication logic
    └── storage.js         # Secure storage functions
```

## Setup & Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure the environment**:
   The app uses environment variables from the root `.env` file via app.config.js.
   Ensure the `EXPO_API_URL` is set to your backend server's IP address.

3. **Start the development server**:

   ```bash
   npx expo start
   ```

4. **Run on a device**:
   - Scan the QR code with Expo Go app
   - Or press `a` for Android emulator, `i` for iOS simulator

## Authentication Flows

### Traditional Flow

1. User enters username/password
2. OTP verification
3. Receives JWT token for transactions

### AANF (SIM-based) Flow

1. App verifies device and carrier
2. Authentication with the backend using simulated SIM credentials
3. Key derivation for secure transaction signing
4. Signed transaction processing

## Key Features Implementation

### Secure Storage

- JWT tokens and AKMA keys stored in `expo-secure-store`
- Transaction history with integrity verification

### Transaction Signing

- Transactions signed with derived keys
- Signatures verified by the backend before processing

### UI Components

- React Native Paper components for consistent UI
- Loading animations and success screens
- Toast notifications for user feedback

## Screens

- **HomeScreen**: Entry point with auth flow options
- **TraditionalLoginScreen**: Username/password login
- **TraditionalOTPScreen**: OTP verification
- **TraditionalTransactionScreen**: Process transactions
- **AANFAuthScreen**: SIM-based authentication
- **AANFTransactionScreen**: Process secure transactions
- **TransactionSuccessScreen**: Confirmation display
- **TransactionHistoryScreen**: View past transactions

## Debugging

For debugging network calls, the app includes comprehensive logging:

- API request/response logging
- Authentication flow tracing
- Transaction signature verification

## Troubleshooting

- **API Connection Issues**:

  - Ensure backend is running
  - Update `EXPO_API_URL` in .env with correct IP address
  - Check network connectivity between device and server

- **Authentication Failures**:

  - Verify test credentials match backend settings
  - Check carrier name against supported carriers list

- **Expo Issues**:
  - Clear cache with `npx expo start --clear`
  - Ensure Expo Go is up to date

## Testing

For testing the AANF flow, the app simulates SIM credentials. In a real-world implementation, this would interface with actual SIM hardware through carrier APIs.
