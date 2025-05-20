# AANF Banking App

A secure banking application with Advanced Authentication and Network Fingerprinting (AANF) technology.

## Project Overview

This project is a mobile banking application that demonstrates enhanced security through advanced authentication techniques and network fingerprinting. The application consists of two main components:

- **Frontend**: A React Native mobile app built with Expo
- **Backend**: A FastAPI-based server providing authentication and banking services

## Features

- 📱 Mobile banking interface with modern UI
- 🔐 Multi-factor authentication (Password + OTP)
- 📍 Network fingerprinting for enhanced security
- 💸 Basic banking operations (balance check, transfers)
- 📊 Transaction history and account management
- ⚡ Fast and responsive API

## Project Structure

```
aanf-banking-app/
├── frontend/            # React Native with Expo mobile app
│   └── README.md       # Frontend documentation
├── backend/            # FastAPI server
│   └── README.md       # Backend documentation
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- Python 3.8+
- Expo CLI (`npm install -g expo-cli`)

### Setup Instructions

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd aanf-banking-app
   ```

2. **Set up backend**

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Set up frontend**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Update API URL**

   - Open `frontend/services/api.js` and update the `BASE_URL` constant
   - Or create a `.env.local` file in the root with `EXPO_API_URL=http://YOUR_IP:8000`

5. **Start the frontend**

   ```bash
   npm start
   ```

6. **Run on physical device**
   - Scan the QR code with Expo Go app

### Environment Variables

Create a copy of `.env.example` to `.env` and update with your settings:

- `API_URL`: Backend API URL
- `JWT_SECRET_KEY`: Secret key for JWT tokens
- `SUPPORTED_CARRIERS`: Comma-separated list of supported carriers
- `EXPO_API_URL`: URL for the Expo app to connect to backend

### Default Test Credentials

- Username: testuser
- Password: 123456
- OTP: 000000

## Technology Stack

### Frontend

- React Native with Expo
- React Navigation
- Axios for API communication
- Expo Vector Icons
- AsyncStorage for local storage

### Backend

- FastAPI (Python)
- JWT for authentication
- SQLAlchemy for database
- Pydantic for data validation

## Advanced Authentication and Network Fingerprinting (AANF)

AANF is a security approach that combines:

**Multi-factor authentication:**

- Something you know (password)
- Something you have (OTP via device)

**Network fingerprinting:**

- Device identification
- Network pattern analysis
- Location-based verification

This combination provides significantly stronger security than traditional authentication methods.

## Troubleshooting

- **Backend Connection**: Ensure you're using your computer's local IP address (not localhost) in the API configuration
- **CORS Issues**: The backend is configured to accept connections from the Expo development server
- **Device Testing**: For physical device testing, ensure both your phone and development machine are on the same network

## Additional Documentation

- See `frontend/README.md` for more details on the mobile app
- See `backend/README.md` for API documentation and server details
