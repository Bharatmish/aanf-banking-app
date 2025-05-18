from fastapi import APIRouter, Request, HTTPException, Header
from fastapi.responses import JSONResponse
from models.schemas import TransactionRequest
from logic.storage import sessions
import secrets

router = APIRouter()

# ----------------------
# ✅ AANF AUTHENTICATION
# ----------------------
@router.post("/authenticate")
async def authenticate(request: Request):
    body = await request.json()
    carrier = body.get("carrier", "Unknown")
    model = body.get("model", "Unknown")

    print(f"[AANF] Authenticating carrier: {carrier}, device: {model}")

    if carrier.lower() in ["airtel", "jio", "vi", "bsnl"]:  # Trusted carriers
        akma_key = secrets.token_hex(16)
        sessions["akma_key"] = akma_key
        print(f"🗝️ New AKMA key generated and stored: {akma_key}")
        return JSONResponse(content={"akma_key": akma_key})
    else:
        print("[AANF] ❌ Untrusted carrier or device.")
        return JSONResponse(status_code=403, content={"error": "Untrusted carrier"})

# ----------------------------
# ✅ AANF SECURE TRANSACTION
# ----------------------------
@router.post("/transaction")
def aanf_transaction(req: TransactionRequest, x_akma_key: str = Header(None)):
    print(f"📦 Received AKMA key in header: {x_akma_key}")
    print(f"🗃️ Stored session AKMA key: {sessions.get('akma_key')}")

    if sessions.get("akma_key") == x_akma_key:
        print(f"[AANF] ✅ Transaction authorized. Amount: ₹{req.amount}")
        return {"message": f"Transaction of ₹{req.amount} successful via AANF"}
    
    print("[AANF] ❌ Invalid or expired AKMA key.")
    raise HTTPException(status_code=403, detail="Invalid or expired AKMA key")

# ----------------------
# ✅ AANF LOGOUT
# ----------------------
@router.post("/logout")
def logout(x_akma_key: str = Header(None)):
    if sessions.get("akma_key") == x_akma_key:
        sessions.pop("akma_key", None)
        print("[AANF] 🔒 User logged out. AKMA key invalidated.")
        return {"message": "Session ended"}
    
    print("[AANF] ❌ Logout attempt with invalid session key.")
    raise HTTPException(status_code=400, detail="Invalid session")
