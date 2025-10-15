from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from models.db import engine
from models.session_model import Session as ChatSession
from models.message_model import Message
from typing import List

router = APIRouter()

def get_db():
    with Session(engine) as session:
        yield session

@router.post("/session")
async def create_session(db: Session = Depends(get_db)):
    session = ChatSession()
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"id": session.id}

@router.get("/session/{session_id}/history")
async def get_session_history(session_id: str, db: Session = Depends(get_db)):
    # Verify session exists
    session = db.get(ChatSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get messages
    messages = db.query(Message).filter(Message.session_id == session_id).order_by(Message.timestamp).all()
    
    return [
        {
            "id": msg.id,
            "content": msg.content,
            "role": msg.role,
            "timestamp": msg.timestamp.isoformat(),
            "confidence": msg.confidence
        }
        for msg in messages
    ]