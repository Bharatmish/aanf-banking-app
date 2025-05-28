import os
import hashlib
import hmac
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend

def generate_ki():
    """Generate a random Ki (subscriber authentication key)"""
    ki = os.urandom(32).hex()
    print(f"🔑 [CRYPTO] Generated new Ki: {ki[:8]}...")
    return ki

def derive_kakma(ki, device_id):
    """Derive KAKMA (Authentication Key) from Ki and device_id"""
    print(f"🔑 [CRYPTO] Deriving KAKMA from Ki: {ki[:8]}... and device: {device_id[:8] if len(device_id) > 8 else device_id}")
    
    if not ki or not device_id:
        raise ValueError("Ki and device_id must not be empty")
        
    # Use HMAC-SHA256 to derive KAKMA
    key = ki.encode() if isinstance(ki, str) else ki
    message = device_id.encode() if isinstance(device_id, str) else device_id
    
    h = hmac.new(key, message, hashlib.sha256)
    kakma = h.hexdigest()
    print(f"🔐 [CRYPTO] KAKMA derived: {kakma[:8]}...")
    return kakma

def generate_akid(kakma):
    """Generate a unique AKID (Authentication Key ID) from KAKMA"""
    if not kakma:
        raise ValueError("KAKMA must not be empty")
        
    # Create a unique ID using part of KAKMA and timestamp
    import time
    timestamp = str(int(time.time()))
    
    key = kakma.encode() if isinstance(kakma, str) else kakma
    message = timestamp.encode()
    
    h = hmac.new(key, message, hashlib.sha256)
    akid = h.hexdigest()[:16]  # Use first 16 chars as ID
    print(f"🏷️ [CRYPTO] AKID generated: {akid}")
    return akid

def derive_kaf(kakma, afid):
    """
    Derive KAF (Application Function Key) using SHA-256
    
    Args:
        kakma: Authentication Key Material
        afid: Application Function ID (e.g., 'transactions', 'authentication')
    
    Returns:
        Derived key for specific application function
    """
    print(f"🔄 [CRYPTO] Deriving KAF for function: {afid}")
    
    if not kakma or not afid:
        raise ValueError("KAKMA and AFID must not be empty")
    
    # In this implementation, we're using akid directly instead of kakma
    # This is for demo/testing purposes - in production,
    # KAF would be derived using the proper key material
        
    # Ensure consistent string encoding between frontend and backend
    kakma_str = kakma if isinstance(kakma, str) else kakma.decode()
    afid_str = afid if isinstance(afid, str) else afid.decode()
    
    # Match frontend KAF derivation exactly
    # The frontend concatenates these without separators
    message = f"{kakma_str}{afid_str}AANF Banking App KAF Derivation"
    
    h = hashlib.sha256(message.encode())
    kaf = h.hexdigest()
    print(f"🔐 [CRYPTO] KAF derived: {kaf[:8]}...")
    return kaf

def sign_transaction(data, kaf):
    """
    Sign transaction data using KAF
    
    Args:
        data: Transaction data (string, bytes or dict)
        kaf: Application Function Key
    
    Returns:
        HMAC signature
    """
    print(f"📝 [CRYPTO] Signing data with KAF: {kaf[:8]}...")
    print(f"📄 [CRYPTO] Data to sign: {data}")
    
    if isinstance(data, dict):
        # Match the frontend's JSON.stringify behavior - no spaces after colons
        import json
        data = json.dumps(data, sort_keys=True, separators=(',', ':'))
    
    data_bytes = data.encode() if isinstance(data, str) else data
    kaf_bytes = kaf.encode() if isinstance(kaf, str) else kaf
    
    # Calculate HMAC
    h = hmac.new(kaf_bytes, data_bytes, hashlib.sha256)
    signature = h.hexdigest()
    print(f"🔏 [CRYPTO] Generated signature: {signature[:16]}...")
    return signature

def verify_transaction(data, kaf, signature):
    """
    Verify transaction integrity using KAF
    
    Args:
        data: Transaction data (string or bytes)
        kaf: Application Function Key
        signature: HMAC signature to verify
    
    Returns:
        Boolean indicating if signature is valid
    """
    print(f"🔍 [CRYPTO] Verifying transaction signature...")
    print(f"📝 [CRYPTO] Data being verified: {data}")
    print(f"🔑 [CRYPTO] Using KAF: {kaf[:8]}...")
    print(f"🔏 [CRYPTO] Expected signature: {signature}")
    
    if isinstance(data, dict):
        # Match the frontend's JSON.stringify behavior - no spaces after colons
        import json
        data = json.dumps(data, sort_keys=True, separators=(',', ':'))
    
    data_bytes = data.encode() if isinstance(data, str) else data
    kaf_bytes = kaf.encode() if isinstance(kaf, str) else kaf
    
    # Calculate HMAC
    h = hmac.new(kaf_bytes, data_bytes, hashlib.sha256)
    calculated_signature = h.hexdigest()
    print(f"🔏 [CRYPTO] Calculated signature: {calculated_signature}")
    
    # Constant-time comparison to prevent timing attacks
    result = hmac.compare_digest(calculated_signature, signature)
    print(f"✅ [CRYPTO] Signature verification: {'SUCCESS' if result else 'FAILED'}")
    return result