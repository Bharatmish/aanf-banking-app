# AANF Banking App Backend

FastAPI backend service that supports both traditional and AANF authentication flows.

## Technology Stack

- FastAPI: Modern Python web framework
- SQLAlchemy: Database ORM
- Pydantic: Data validation and schemas
- JWT: Token-based authentication
- Cryptography: For AANF security functions

## Features

- **Dual Authentication Flows**:
  - Traditional: Username/password + OTP
  - AANF: SIM-based authentication
- **Secure Transaction Processing**
- **Cryptographic Signature Verification**
- **Database Storage** for users, keys, and transactions

## Project Structure

```
backend/
├── main.py                # Application entry point
├── requirements.txt       # Python dependencies
├── aanf_banking.db        # SQLite database
├── routes/
│   ├── traditional.py     # Traditional auth endpoints
│   └── aanf.py            # AANF auth endpoints
├── models/
│   ├── database.py        # Database models
│   └── schemas.py         # Request/response schemas
└── logic/
    ├── auth.py            # Authentication logic
    ├── crypto_utils.py    # Cryptographic functions
    └── storage.py         # Session storage
```

## Setup & Installation

1. **Create a virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**:

   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Endpoints

### Traditional Flow

- `POST /traditional/login`: Authenticate with username and password

  - Request: `{"username": "string", "password": "string"}`
  - Response: `{"message": "OTP sent to your number"}`

- `POST /traditional/verify-otp`: Verify OTP and generate JWT token

  - Request: `{"otp": "string"}`
  - Response: `{"token": "jwt-token"}`

- `POST /traditional/transaction`: Execute transaction with JWT authentication

  - Headers: `Authorization: Bearer <token>`
  - Request: `{"amount": float}`
  - Response: `{"message": "Transaction successful..."}`

### AANF Flow

- `POST /aanf/authenticate`: Authenticate using SIM and device info

  - Request: `{"carrier": "string", "model": "string"}`
  - Response: `{"akma_key": "string"}`

- `POST /aanf/create-session`: Create a session with application function key

  - Headers: `x-akma-key: <key>`
  - Request: `{"function_id": "string"}`
  - Response: `{"session_id": "string", "function_id": "string", "kaf": "string"}`

- `POST /aanf/transaction`: Execute transaction with AKMA key authentication

  - Headers: `x-akma-key: <key>, x-transaction-sig: <signature>`
  - Request: `{"amount": float}`
  - Response: `{"message": "Transaction successful...", "signature": "string"}`

- `POST /aanf/logout`: Invalidate AKMA key

  - Headers: `x-akma-key: <key>`
  - Response: `{"message": "Session ended"}`

## Database

The application uses SQLite for development with the following models:

- **User**: Basic user information
- **SimKey**: SIM-based authentication keys
- **Transaction**: Record of all transactions

## Testing

### Test Credentials

- Username: `testuser` (from .env)
- Password: `123456` (from .env)
- OTP: `000000` (from .env)

### API Documentation

When the server is running, access the Swagger UI at:

- http://localhost:8000/docs

## Debugging

The backend provides detailed logs for:

- Authentication attempts
- Transaction processing
- Signature validation
- Error conditions

## Troubleshooting

- **Database access errors**: Ensure the SQLite file has proper permissions
- **Missing environment variables**: Check that .env is properly loaded
- **Network errors**: Verify that the port is not blocked by a firewall
