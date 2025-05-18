from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class OTPRequest(BaseModel):
    otp: str

class TransactionRequest(BaseModel):
    amount: float
