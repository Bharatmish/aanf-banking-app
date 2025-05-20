import os
from fastapi import APIRouter, HTTPException, Header
from models.schemas import LoginRequest, OTPRequest, TransactionRequest
from logic.storage import sessions
from jose import jwt
import time

router = APIRouter()
# Use environment variables for sensitive values
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "development_secret_key")

# For development, use environment variables with defaults
VALID_USERNAME = os.environ.get("DEMO_USERNAME", "testuser")
VALID_PASSWORD = os.environ.get("DEMO_PASSWORD", "123456")
VALID_OTP = os.environ.get("DEMO_OTP", "000000")

# ----------------------
# ✅ Traditional Login
# ----------------------
@router.post("/login")
def login(req: LoginRequest):
    print("\n" + "="*60)
    print(f"🔑 [TRADITIONAL] Login Request at {time.strftime('%H:%M:%S')}")
    print(f"👤 Username: {req.username}")
    print("="*60)
    
    if req.username == VALID_USERNAME and req.password == VALID_PASSWORD:
        print(f"✅ Login SUCCESS for user: {req.username}")
        print("📱 OTP would be sent to user's phone in production")
        print("="*60 + "\n")
        return {"message": "OTP sent to your number"}
    
    print(f"❌ Login FAILED for user: {req.username}")
    print("="*60 + "\n")
    raise HTTPException(status_code=401, detail="Invalid credentials")

# ----------------------
# ✅ OTP Verification
# ----------------------
@router.post("/verify-otp")
def verify_otp(req: OTPRequest):
    print("\n" + "="*60)
    print(f"🔐 [TRADITIONAL] OTP Verification Request at {time.strftime('%H:%M:%S')}")
    print(f"🔢 OTP: {req.otp}")
    print("="*60)
    
    if req.otp == VALID_OTP:
        payload = {
            "sub": "testuser",
            "iat": int(time.time()),
            "exp": int(time.time()) + 3600
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        sessions["traditional_token"] = token
        print(f"✅ OTP Verification SUCCESS")
        print(f"🗝️ New JWT token generated: {token[:15]}...")
        print("="*60 + "\n")
        return {"token": token}
    
    print(f"❌ OTP Verification FAILED")
    print("="*60 + "\n")
    raise HTTPException(status_code=400, detail="Invalid OTP")

# ----------------------
# ✅ Traditional Transaction with Logging
# ----------------------
@router.post("/transaction")
def traditional_transaction(req: TransactionRequest, authorization: str = Header("")):
    print("\n" + "="*60)
    print(f"💰 [TRADITIONAL] Transaction Request at {time.strftime('%H:%M:%S')}")
    print(f"📊 Amount: ₹{req.amount}")
    
    token = authorization.replace("Bearer ", "")
    print(f"📦 Received token (first 15 chars): {token[:15]}...")
    print(f"🗃️ Stored token (first 15 chars): {sessions.get('traditional_token', '')[:15]}...")

    if sessions.get("traditional_token") == token:
        print(f"✅ Transaction APPROVED | Amount: ₹{req.amount}")
        print("="*60 + "\n")
        return {"message": f"Transaction of ₹{req.amount} successful via traditional flow"}

    print(f"❌ Transaction REJECTED | Invalid or expired token")
    print("="*60 + "\n")
    raise HTTPException(status_code=403, detail="Unauthorized or expired session")
