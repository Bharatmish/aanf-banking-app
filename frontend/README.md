# AANF Banking App Frontend

React Native mobile application demonstrating secure banking with multiple authentication methods.

## Technology Stack

- React Native with Expo
- React Navigation
- React Native Paper for UI components
- Secure Storage for token management
- Lottie for animations

## Features

- Two authentication flows:
  - Traditional: Username/password + OTP
  - AANF: SIM-based authentication
- Transaction history
- Secure token storage using Expo SecureStore
- Animations for transaction success

## Setup & Installation

1. Make sure you have Node.js and npm installed
2. Install Expo CLI:

```bash
npm install -g expo-cli
```

3. Install project dependencies:

```bash
cd frontend
npm install
```

4. Update API endpoint:
   Open `services/api.js` and update the `BASE_URL` constant with your backend server IP

5. Start the development server:

```bash
npm start
```

6. Use Expo Go app on your device to scan the QR code, or run on a simulator

## Navigation Structure

- Home Screen: Entry point with options for both authentication flows
- Traditional Flow:
  - Login → OTP Verification → Transaction
- AANF Flow:
  - SIM Authentication → Transaction
- Transaction History: View all past transactions
- Success Screen: Shows transaction confirmation

## Storage

The app uses two storage mechanisms:

- `expo-secure-store`: For secure token storage (JWT, AKMA keys)
- `AsyncStorage`: For transaction history

## Development

When testing the AANF flow, the app is configured to use "Jio" as a trusted carrier for demonstration purposes.
