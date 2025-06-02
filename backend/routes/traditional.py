import os
import time
from fastapi import APIRouter, HTTPException, Header, Depends
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from models.schemas import LoginRequest, OTPRequest, PinRequest, TransactionRequest
from logic.storage import sessions
from models.database import get_db, User, Transaction
 # Import DB stuff here

router = APIRouter()

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "development_secret_key")
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
            "sub": VALID_USERNAME,  # Use validated username here
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
# ✅ Traditional Transaction with DB logging
# ----------------------
@router.post("/transaction")
def traditional_transaction(
    req: TransactionRequest,
    authorization: str = Header(""),
    db: Session = Depends(get_db)
):
    print("\n" + "="*60)
    print(f"💰 [TRADITIONAL] Transaction Request at {time.strftime('%H:%M:%S')}")
    print(f"📊 Amount: ₹{req.amount}")
    
    token = authorization.replace("Bearer ", "")
    print(f"📦 Received token (first 15 chars): {token[:15]}...")
    print(f"🗃️ Stored token (first 15 chars): {sessions.get('traditional_token', '')[:15]}...")

    if sessions.get("traditional_token") != token:
        print(f"❌ Transaction REJECTED | Invalid or expired token")
        print("="*60 + "\n")
        raise HTTPException(status_code=403, detail="Unauthorized or expired session")

    # Decode token to get username
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")

    # Fetch user from DB
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save transaction in DB
    transaction = Transaction(
        user_id=user.id,
        amount=req.amount,
        method="Traditional"
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    print(f"✅ Transaction APPROVED | Amount: ₹{req.amount}")
    print("="*60 + "\n")
    return {"message": f"Transaction of ₹{req.amount} successful via traditional flow"}

# ----------------------
# ✅ PIN Verification
# ----------------------
@router.post("/verify-pin")
def verify_pin(req: PinRequest):
    VALID_PIN = os.environ.get("DEMO_PIN", "1234")  # Default demo PIN
    print("\n" + "="*60)
    print(f"🔐 [TRADITIONAL] PIN Verification Request at {time.strftime('%H:%M:%S')}")
    print(f"🔢 PIN: {req.pin}")
    print("="*60)

    if req.pin == VALID_PIN:
        payload = {
            "sub": VALID_USERNAME,
            "iat": int(time.time()),
            "exp": int(time.time()) + 3600
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        sessions["traditional_token"] = token
        print(f"✅ PIN Verification SUCCESS")
        print(f"🗝️ New JWT token generated: {token[:15]}...")
        print("="*60 + "\n")
        return {"token": token}

    print(f"❌ PIN Verification FAILED")
    print("="*60 + "\n")
    raise HTTPException(status_code=400, detail="Invalid PIN")

# ----------------------
# ✅ Transaction History (Optional)
# ----------------------
@router.get("/transaction-history")
def get_transaction_history(
    authorization: str = Header(""),
    db: Session = Depends(get_db)
):
    token = authorization.replace("Bearer ", "")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    transactions = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    return {
        "transactions": [
            {
                "amount": t.amount,
                "method": t.method,
                "timestamp": t.timestamp.isoformat()
            }
            for t in transactions
        ]
    }
