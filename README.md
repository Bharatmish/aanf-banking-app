# AANF Banking App

A secure banking application demonstrating Advanced Authentication and Network Fingerprinting (AANF) technology.

## Project Overview

This application showcases enhanced security through advanced authentication techniques and network fingerprinting, with both traditional and SIM-based authentication flows. The project consists of:

- **Frontend**: React Native mobile app built with Expo
- **Backend**: FastAPI server providing authentication and banking services

## Features

- 📱 Mobile banking interface with modern UI
- 🔐 Dual authentication flows:
  - Traditional: Username/password + OTP
  - AANF: SIM-based authentication with crypto signatures
- 💳 Secure transaction processing with signature verification
- 📊 Transaction history with integrity verification
- 🛡️ Secure storage for sensitive data

## Project Structure

```
aanf-banking-app/
├── .env                  # Environment variables for the entire project
├── frontend/            # React Native with Expo mobile app
│   ├── screens/         # UI screens
│   ├── services/        # API services
│   ├── utils/           # Helper functions
│   └── components/      # Reusable UI components
├── backend/             # FastAPI server
│   ├── routes/          # API route handlers
│   ├── models/          # Data models and schemas
│   └── logic/           # Business logic
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python 3.8+
- Expo CLI (`npm install -g expo-cli`)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd aanf-banking-app
   ```

2. **Set up environment variables**

   Create or update the `.env` file in the root directory:

   ```
   # API Configuration
   API_URL=http://YOUR_IP_ADDRESS:8000
   EXPO_API_URL=http://YOUR_IP_ADDRESS:8000

   # JWT Configuration
   JWT_SECRET_KEY=64cb19f732b455e1e70a30ce832d21bd7821db0ff190f9c1a9695d0262b1db5a

   # Demo Credentials
   DEMO_USERNAME=testuser
   DEMO_PASSWORD=123456
   DEMO_OTP=000000

   # Supported Carriers
   SUPPORTED_CARRIERS=Airtel,Jio,Vi,BSNL,T-Mobile,Verizon,AT&T,Vodafone,Unknown

   # Development & Testing
   DEV_MODE=true
   LOG_LEVEL=debug
   ```

   Replace `YOUR_IP_ADDRESS` with your machine's IP address on the local network.

3. **Set up and start the backend**

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

4. **Set up and start the frontend**

   ```bash
   cd ../frontend
   npm install
   npx expo start
   ```

5. **Run on a device**
   - Scan the QR code with the Expo Go app
   - Or run on a simulator/emulator

## Authentication Flows

### Traditional Flow

1. Login with username/password
2. OTP verification
3. JWT token-based transaction approval

### AANF Flow

1. SIM-based authentication using device and carrier info
2. Key derivation for secure authentication
3. Cryptographically signed transactions

## Important Notes

- **Local IP Address**: Use your computer's IP address (not localhost/127.0.0.1) for testing on physical devices
- **Single Node Modules**: The project is structured with node_modules only in the frontend directory
- **Environment Configuration**: Update the IP address in the .env file when your network changes
- **Test Credentials**: Use the demo credentials from the .env file for testing

## Troubleshooting

- **Network Errors**: Make sure your device and development machine are on the same network
- **Connection Issues**: Check that the IP address in .env is correct
- **Missing Modules**: Run `npm install` in the frontend directory
- **Database Errors**: Make sure the SQLite database file is accessible to the backend

## Technology Stack

### Frontend

- React Native with Expo
- React Navigation
- React Native Paper UI
- Secure Storage
- Lottie Animations

### Backend

- FastAPI
- SQLAlchemy
- JWT Authentication
- Cryptographic Libraries
