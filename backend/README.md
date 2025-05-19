# AANF Banking App Backend

FastAPI backend service that supports both traditional and AANF authentication flows.

## Technology Stack

- FastAPI
- Pydantic for data validation
- JWT for traditional authentication
- AKMA keys for AANF authentication

## Features

- Traditional login with username/password + OTP verification
- AANF authentication using carrier and device information
- Secure transaction processing for both flows
- Session management

## Setup & Installation

1. Make sure you have Python 3.7+ installed
2. Install dependencies:

```bash
pip install fastapi uvicorn pydantic python-jose
```

3. Start the server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Routes

### Traditional Flow

- `POST /traditional/login` - Authenticate with username and password
- `POST /traditional/verify-otp` - Verify OTP and generate JWT token
- `POST /traditional/transaction` - Execute transaction with JWT authentication

### AANF Flow

- `POST /aanf/authenticate` - Authenticate using SIM and device info
- `POST /aanf/transaction` - Execute transaction with AKMA key authentication
- `POST /aanf/logout` - Invalidate AKMA key

## Development

For demonstration purposes, the app uses in-memory storage for session data. In a production environment, this would be replaced with a proper database.

### Testing Credentials

- Username: `testuser`
- Password: `123456`
- OTP: `000000`
