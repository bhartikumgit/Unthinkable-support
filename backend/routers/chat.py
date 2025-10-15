from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session
from datetime import datetime
import logging

from models.db import get_session
from models.message_model import Message
from models.session_model import Session as ChatSession
from services.llm_service import llm_service
from services.memory_manager import MemoryManager

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/chat")
async def chat(request: Request, db: Session = Depends(get_session)):
    try:
        # Parse request data
        data = await request.json()
        session_id = data.get("session_id")
        user_message = data.get("message")
        metadata = data.get("metadata", {})

        # Validate required fields
        if not session_id or not user_message:
            raise HTTPException(status_code=400, detail="Session ID and message are required")

        logger.info(f"Processing chat request - Session: {session_id}, Message: {user_message}")

        # Get or validate session
        chat_session = db.get(ChatSession, session_id)
        if not chat_session:
            raise HTTPException(status_code=404, detail="Session not found")

        # Initialize memory manager
        memory_manager = MemoryManager(db=db, session_id=session_id)

        # Update session and save user message
        chat_session.last_activity = datetime.utcnow()
        db.add(chat_session)
        db.commit()

        memory_manager.add_message(
            content=user_message,
            role="user",
            metadata=metadata
        )

        # Get conversation history
        history = memory_manager.get_conversation_history()
        context = "\n".join([f"{msg.role}: {msg.content}" for msg in history[-5:]])

        try:
            # Get AI response
            response_text, confidence = await llm_service.get_response(user_message, context)
            logger.info(f"LLM Response: {response_text}, Confidence: {confidence}")

            # Use default response if needed
            if not response_text or response_text.startswith("I apologize"):
                response_text, confidence = llm_service._generate_default_response(user_message)
                logger.info(f"Using default response: {response_text}")

            # Save bot message
            memory_manager.add_message(
                content=response_text,
                role="assistant",
                confidence=confidence
            )

            # Update session activity
            memory_manager.update_session_activity()

            return {
                "response": response_text,
                "confidence": confidence,
                "escalated": response_text == "ESCALATE"
            }

        except Exception as e:
            logger.error(f"Error in chat processing: {str(e)}", exc_info=True)
            error_module = e.__class__.__module__ or ""
            
            if "google" in error_module.lower() or "generativeai" in error_module.lower():
                error_msg = "I apologize, but I'm having trouble connecting to the AI service. Please try again in a moment."
                if "permission" in str(e).lower() or "credential" in str(e).lower():
                    error_msg = "The AI service is currently unavailable due to authentication issues. Please try again later."
                elif "rate" in str(e).lower() or "quota" in str(e).lower():
                    error_msg = "The AI service is temporarily busy. Please try again in a few moments."
                
                return {
                    "response": error_msg,
                    "confidence": 0.0,
                    "escalated": False
                }
            raise

    except Exception as e:
        logger.error(f"Error in request handling: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))