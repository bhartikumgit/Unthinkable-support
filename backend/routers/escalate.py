from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from models.db import engine
from models.escalate_model import EscalationTicket
from pydantic import BaseModel

router = APIRouter()

class EscalationRequest(BaseModel):
    session_id: str
    issue: str

def get_db():
    with Session(engine) as session:
        yield session

@router.post("/escalate")
async def create_escalation(request: EscalationRequest, db: Session = Depends(get_db)):
    ticket = EscalationTicket(
        session_id=request.session_id,
        issue=request.issue,
        status="pending"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    
    return {
        "id": ticket.id,
        "session_id": ticket.session_id,
        "status": ticket.status,
        "created_at": ticket.created_at.isoformat()
    }