from sqlmodel import Session, select
from typing import List
from datetime import datetime, timedelta
from models.message_model import Message
from models.session_model import Session as ChatSession

class MemoryManager:
    def __init__(self, db: Session, session_id: str, max_age_minutes: int = 30):
        self.db = db
        self.session_id = session_id
        self.max_age_minutes = max_age_minutes

    def get_conversation_history(self) -> List[Message]:
        """
        Retrieves the conversation history for the current session,
        only including messages within the max_age_minutes.
        """
        cutoff_time = datetime.utcnow() - timedelta(minutes=self.max_age_minutes)
        messages = self.db.exec(
            select(Message)
            .where(Message.session_id == self.session_id)
            .where(Message.timestamp >= cutoff_time)
            .order_by(Message.timestamp)
        ).all()
        return messages

    def add_message(self, content: str, role: str, confidence: float = None, metadata: dict = None):
        """
        Adds a new message to the conversation history.
        """
        message = Message(
            session_id=self.session_id,
            content=content,
            role=role,
            confidence=confidence,
            meta_data=metadata,
            timestamp=datetime.utcnow()
        )
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def update_session_activity(self):
        """
        Updates the last_activity timestamp of the session.
        """
        session = self.db.get(ChatSession, self.session_id)
        if session:
            session.last_activity = datetime.utcnow()
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)