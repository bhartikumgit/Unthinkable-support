from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
from sqlalchemy import JSON, Column

class Message(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    session_id: str = Field(foreign_key="session.id")
    content: str
    role: str = Field(default="user")  # 'user' or 'assistant'
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    confidence: Optional[float] = Field(default=None)
    meta_data: Optional[dict] = Field(default=None, sa_column=Column(JSON))  # Changed from metadata to meta_data