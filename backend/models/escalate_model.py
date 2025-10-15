from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class EscalationTicket(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    session_id: str = Field(foreign_key="session.id")
    issue: str
    status: str = Field(default="pending")  # pending, in_progress, resolved
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = Field(default=None)
    assigned_to: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None)
