from sqlmodel import SQLModel, create_engine, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./support_bot.db")

# Create engine with connect_args for SQLite to handle threading
engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

def create_db_and_tables():
    """Create database tables if they don't exist"""
    # Import all models to ensure they're registered with SQLModel
    from models.session_model import Session as ChatSession
    from models.message_model import Message
    from models.escalate_model import EscalationTicket
    
    # Create tables with checkfirst=True to avoid errors if tables exist
    SQLModel.metadata.create_all(engine, checkfirst=True)

def get_session():
    """Get a database session. Use as a FastAPI dependency."""
    with Session(engine) as session:
        try:
            yield session
        finally:
            session.close()