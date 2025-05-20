from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routes import traditional, aanf
from models.database import get_db, SessionLocal
from sqlalchemy import text  # Add this import
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Then access variables with os.environ
jwt_secret = os.environ.get("JWT_SECRET_KEY")
supported_carriers = os.environ.get("SUPPORTED_CARRIERS", "").split(",")

print("\n" + "="*80)
print("🚀 Starting AANF Banking API...")
print(f"🔐 JWT Secret loaded: {'Yes' if jwt_secret else 'No'}")
print(f"📱 Supported Carriers: {', '.join(supported_carriers)}")
print("="*80 + "\n")

app = FastAPI(
    title="AANF Banking API",
    description="Simulated backend for Traditional and AANF-based banking",
    version="1.0.0"
)

# Register route modules with path prefixes
app.include_router(traditional.router, prefix="/traditional")
app.include_router(aanf.router, prefix="/aanf")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "https://ec43-2409-40f4-40cd-c746-78f5-eeaa-4d86-f725.ngrok-free.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add database dependency to startup
@app.on_event("startup")
async def startup():
    print("\n" + "="*80)
    print("📦 Initializing database connection...")
    # Initialize database connection
    db = SessionLocal()
    try:
        # Validate database connection
        db.execute(text("SELECT 1"))
        print("✅ Database connection successful")
        
        # Count existing users
        from models.database import User
        user_count = db.query(User).count()
        print(f"👥 Found {user_count} existing users in database")
        
        # Count existing transactions
        from models.database import Transaction
        tx_count = db.query(Transaction).count()
        print(f"💰 Found {tx_count} existing transactions in database")
        
    except Exception as e:
        print(f"❌ Database error: {e}")
    finally:
        db.close()
    print("="*80 + "\n")

@app.get("/")
def read_root():
    return {"status": "online", "message": "AANF Banking API is running"}

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, x-akma-key, x-transaction-sig"
    return response
