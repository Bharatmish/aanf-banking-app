from fastapi import APIRouter, Request, HTTPException, Header, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
import json
import time
import os  # Add this to the top of the file

from models.schemas import TransactionRequest, SessionRequest
from models.database import get_db, SimKey, User, Transaction
from logic.crypto_utils import derive_kakma, generate_akid, derive_kaf, sign_transaction, verify_transaction

router = APIRouter()

# ----------------------
# ✅ AANF AUTHENTICATION
# ----------------------
@router.post("/authenticate")
async def authenticate(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    carrier = body.get("carrier", "Unknown")
    model = body.get("model", "Unknown")
    device_id = body.get("device_id", model)  # Use model as device_id if not provided

    print("\n" + "="*60)
    print(f"🔍 [AANF] Authentication Request at {time.strftime('%H:%M:%S')}")
    print(f"📱 Device: {model} | Carrier: {carrier}")
    print(f"🆔 Device ID: {device_id}")
    print("="*60)
    
    # For demo/hackathon purposes, create a simulated user and Ki if not exists
    user = db.query(User).filter(User.username == "demo_user").first()
    if not user:
        print("👤 Creating new demo user...")
        user = User(username="demo_user", phone_number="9876543210")
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"✅ New user created with ID: {user.id}")
    else:
        print(f"👤 Using existing user: {user.username} (ID: {user.id})")
    
    # Check if this device has a SimKey record
    sim_key = db.query(SimKey).filter(
        SimKey.user_id == user.id,
        SimKey.device_id == device_id,
        SimKey.active == 1
    ).first()
    
    if not sim_key:
        print("🔄 No existing SIM key for this device, creating new...")
        # In real world, Ki would be fetched from actual SIM via carrier
        # For demo, generate a simulated Ki
        from logic.crypto_utils import generate_ki
        ki = generate_ki()
        print(f"🔑 Generated Ki: {ki[:8]}...")
        
        kakma = derive_kakma(ki, device_id)
        print(f"🔐 Derived KAKMA: {kakma[:8]}...")
        
        akid = generate_akid(kakma)
        print(f"🏷️ Generated AKID: {akid}")
        
        sim_key = SimKey(
            user_id=user.id,
            ki=ki,
            kakma=kakma,
            akid=akid,
            device_id=device_id,
            carrier=carrier
        )
        db.add(sim_key)
        db.commit()
        db.refresh(sim_key)
        print(f"✅ New SIM key stored with ID: {sim_key.id}")
    else:
        print(f"🔄 Using existing SIM key: {sim_key.id}")
        print(f"🏷️ AKID: {sim_key.akid}")
        print(f"🔐 KAKMA: {sim_key.kakma[:8]}...")
    
    # Check if carrier is trusted (read from environment or config)
    supported_carriers = os.environ.get("SUPPORTED_CARRIERS", "Airtel,Jio,Vi,BSNL").split(",")
    carrier_trusted = carrier.lower() in [c.lower() for c in supported_carriers]
    
    # Before returning response
    if carrier_trusted:
        print(f"✅ Authentication SUCCESS | AKMA Key: {sim_key.akid[:8]}...")
        print("="*60 + "\n")
        return JSONResponse(content={"akma_key": sim_key.akid})
    else:
        print(f"❌ Authentication FAILED | Untrusted carrier: {carrier}")
        print(f"💡 Supported carriers: {', '.join(supported_carriers)}")
        print("="*60 + "\n")
        return JSONResponse(status_code=403, content={"error": "Untrusted carrier"})

# ----------------------------
# ✅ CREATE SESSION WITH KAF
# ----------------------------
@router.post("/create-session")
async def create_session(request: SessionRequest, x_akma_key: str = Header(None), db: Session = Depends(get_db)):
    """Create a session and derive KAF for application functions"""
    print("\n" + "="*60)
    print(f"📝 [AANF] Session Creation Request at {time.strftime('%H:%M:%S')}")
    print(f"🔑 AKID: {x_akma_key}")
    print(f"🏷️ Function: {request.function_id or 'transactions'}")
    print("="*60)
    
    # Find the SimKey record for this AKID
    sim_key = db.query(SimKey).filter(SimKey.akid == x_akma_key, SimKey.active == 1).first()
    
    if not sim_key:
        print(f"❌ No active SIM key found for AKID: {x_akma_key}")
        print("="*60 + "\n")
        raise HTTPException(status_code=403, detail="Invalid or expired AKMA key")
    
    print(f"✅ Found active SIM key for user ID: {sim_key.user_id}")
    print(f"🔐 Using KAKMA: {sim_key.kakma[:8]}...")
    
    # Derive KAF for the requested function
    function_id = request.function_id or "transactions"
    kaf = derive_kaf(sim_key.kakma, function_id)
    
    # Before return
    print(f"✅ KAF derived successfully for {function_id}")
    print(f"📊 KAF: {kaf[:8]}...")
    print(f"📤 Sending KAF to frontend for signature verification")
    print("="*60 + "\n")
    
    return {"session_id": sim_key.akid, "function_id": function_id, "kaf": kaf}

# ----------------------------
# ✅ AANF SECURE TRANSACTION
# ----------------------------
@router.post("/transaction")
def aanf_transaction(req: TransactionRequest, x_akma_key: str = Header(None), x_transaction_sig: Optional[str] = Header(None), db: Session = Depends(get_db)):
    print("\n" + "="*60)
    print(f"💰 [AANF] Transaction Request at {time.strftime('%H:%M:%S')}")
    print(f"📊 Amount: ₹{req.amount}")
    print(f"🔑 AKID: {x_akma_key}")
    print(f"🔏 Has Signature: {'Yes' if x_transaction_sig else 'No'}")
    print("="*60)
    
    # Find the SimKey record for this AKID
    sim_key = db.query(SimKey).filter(SimKey.akid == x_akma_key, SimKey.active == 1).first()
    
    if not sim_key:
        print(f"❌ Invalid or expired AKMA key: {x_akma_key}")
        print("="*60 + "\n")
        raise HTTPException(status_code=403, detail="Invalid or expired AKMA key")
    
    print(f"✅ Found valid SIM key for user ID: {sim_key.user_id}")
    print(f"🔐 Using KAKMA: {sim_key.kakma[:8]}...")
    
    # Derive KAF for transactions
    kaf = derive_kaf(sim_key.kakma, "transactions")
    print(f"🔐 Derived KAF: {kaf[:8]}...")
    
    # If a signature is provided, verify transaction integrity
    if x_transaction_sig:
        print(f"🔍 Verifying transaction signature...")
        print(f"🔏 Frontend signature: {x_transaction_sig}")
        
        # Convert transaction request to canonical form
        data_obj = {"amount": float(req.amount)}
        data_str = json.dumps(data_obj, sort_keys=True, separators=(',', ':'))
        
        # Generate expected signature for comparison
        expected_sig = sign_transaction(data_str, kaf)
        print(f"🔏 Backend expected: {expected_sig}")
        
        # Additional debug information
        print(f"JSON string for verification: '{data_str}'")
        print(f"Expected signature: {expected_sig}")
        print(f"Received signature: {x_transaction_sig}")
        
        # Verify signature
        if not verify_transaction(data_str, kaf, x_transaction_sig):
            print("[AANF] ❌ Transaction signature verification failed.")
            print("="*60 + "\n")
            raise HTTPException(status_code=400, detail="Invalid transaction signature")
        else:
            print("[AANF] ✅ Transaction signature verified successfully!")
    
    # Process the transaction
    # In a real app, you would integrate with a payment processor
    print(f"[AANF] ✅ Transaction authorized. Amount: ₹{req.amount}")
    
    # Save transaction record
    transaction = Transaction(
        user_id=sim_key.user_id,
        amount=req.amount,
        method="AANF",
        hash_verification=x_transaction_sig
    )
    db.add(transaction)
    db.commit()
    
    # Sign the response
    response_data = {"message": f"Transaction of ₹{req.amount} successful via AANF", "status": "success"}
    response_signature = sign_transaction(json.dumps(response_data, sort_keys=True), kaf)
    
    # After successful verification
    print(f"✅ Transaction APPROVED | Amount: ₹{req.amount}")
    print(f"🗄️ Saved to database with ID: {transaction.id}")
    print("="*60 + "\n")
    
    return {**response_data, "signature": response_signature}

# ----------------------
# ✅ AANF LOGOUT
# ----------------------
@router.post("/logout")
def logout(x_akma_key: str = Header(None), db: Session = Depends(get_db)):
    print("\n" + "="*60)
    print(f"🚪 [AANF] Logout Request at {time.strftime('%H:%M:%S')}")
    print(f"🔑 AKID: {x_akma_key}")
    
    sim_key = db.query(SimKey).filter(SimKey.akid == x_akma_key).first()
    if sim_key:
        # Mark the key as inactive (logical deletion)
        sim_key.active = 0
        db.commit()
        print("[AANF] 🔒 User logged out. AKMA key invalidated.")
        print("="*60 + "\n")
        return {"message": "Session ended"}
    
    print("[AANF] ❌ Logout attempt with invalid session key.")
    print("="*60 + "\n")
    raise HTTPException(status_code=400, detail="Invalid session")
