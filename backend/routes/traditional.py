from fastapi import APIRouter, HTTPException, Header
from models.schemas import LoginRequest, OTPRequest, TransactionRequest
from logic.storage import sessions
from jose import jwt
import time

router = APIRouter()
SECRET_KEY = "your-secret"

VALID_USERNAME = "testuser"
VALID_PASSWORD = "123456"
VALID_OTP = "000000"

# ----------------------
# ✅ Traditional Login
# ----------------------
@router.post("/login")
def login(req: LoginRequest):
    if req.username == VALID_USERNAME and req.password == VALID_PASSWORD:
        return {"message": "OTP sent to your number"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# ----------------------
# ✅ OTP Verification
# ----------------------
@router.post("/verify-otp")
def verify_otp(req: OTPRequest):
    if req.otp == VALID_OTP:
        payload = {
            "sub": "testuser",
            "iat": int(time.time()),
            "exp": int(time.time()) + 3600
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        sessions["traditional_token"] = token
        print(f"🗝️ New JWT token generated and stored: {token}")
        return {"token": token}
    raise HTTPException(status_code=400, detail="Invalid OTP")

# ----------------------
# ✅ Traditional Transaction with Logging
# ----------------------
@router.post("/transaction")
def traditional_transaction(req: TransactionRequest, authorization: str = Header("")):
    token = authorization.replace("Bearer ", "")
    print(f"📦 Received JWT token in header: {token}")
    print(f"🗃️ Stored session JWT token: {sessions.get('traditional_token')}")

    if sessions.get("traditional_token") == token:
        print(f"[Traditional] ✅ Transaction authorized. Amount: ₹{req.amount}")
        return {"message": f"Transaction of ₹{req.amount} successful via traditional flow"}

    print("[Traditional] ❌ Unauthorized or expired session.")
    raise HTTPException(status_code=403, detail="Unauthorized or expired session")
