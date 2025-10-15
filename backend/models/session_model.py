from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
from sqlalchemy import JSON, Column

class Session(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    meta_data: Optional[dict] = Field(default=None, sa_column=Column(JSON))

    def update_activity(self):
        self.last_activity = datetime.utcnow()