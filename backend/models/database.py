from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime
import os

# Use absolute path for SQLite database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, '../aanf_banking.db')}"  # For development; replace with PostgreSQL URL in production
# For PostgreSQL, use: DATABASE_URL = "postgresql://username:password@localhost/aanf_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    phone_number = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    keys = relationship("SimKey", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    
class SimKey(Base):
    __tablename__ = "sim_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ki = Column(String, unique=True)  # Stored securely
    kakma = Column(String)  # Derived from Ki
    akid = Column(String, unique=True)  # Authentication Key ID
    device_id = Column(String)
    carrier = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    active = Column(Integer, default=1)
    
    user = relationship("User", back_populates="keys")
    
class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    method = Column(String)  # "AANF" or "Traditional"
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    hash_verification = Column(String, nullable=True)  # For transaction integrity verification
    
    user = relationship("User", back_populates="transactions")

# Create the database tables
Base.metadata.create_all(bind=engine)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()