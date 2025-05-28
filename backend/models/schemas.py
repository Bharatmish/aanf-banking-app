from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class OTPRequest(BaseModel):
    otp: str

class TransactionRequest(BaseModel):
    amount: float

class SessionRequest(BaseModel):
    function_id: Optional[str] = "transactions"
