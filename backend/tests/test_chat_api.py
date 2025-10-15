import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from main import app
from models.db import get_db
from services.llm_service import LLMService

# Create in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

def override_get_db():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# Mock Gemini responses
@pytest.fixture
def mock_gemini(monkeypatch):
    async def mock_generate_response(self, prompt: str) -> str:
        return "This is a mock Gemini response. {\"confidence\": 0.8}"
    
    monkeypatch.setattr(
        LLMService,
        "_generate_response",
        mock_generate_response
    )

def test_create_session():
    response = client.post("/api/session")
    assert response.status_code == 200
    assert "id" in response.json()

def test_chat_flow(mock_gemini):
    # Create session
    session_response = client.post("/api/session")
    session_id = session_response.json()["id"]

    # Send chat message
    chat_response = client.post(
        "/api/chat",
        json={
            "session_id": session_id,
            "message": "How do I track my order?"
        }
    )
    assert chat_response.status_code == 200
    assert "content" in chat_response.json()
    assert "confidence" in chat_response.json()

    # Get chat history
    history_response = client.get(f"/api/session/{session_id}/history")
    assert history_response.status_code == 200
    messages = history_response.json()
    assert len(messages) > 0

def test_faq_search():
    response = client.get("/api/faq/search", params={"q": "track order"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "confidence" in data
    assert data["confidence"] > 0.5

def test_create_escalation():
    # Create session first
    session_response = client.post("/api/session")
    session_id = session_response.json()["id"]

    # Create escalation
    escalation_response = client.post(
        "/api/escalate",
        json={
            "session_id": session_id,
            "issue": "Complex refund request"
        }
    )
    assert escalation_response.status_code == 200
    data = escalation_response.json()
    assert "id" in data
    assert data["status"] == "pending"

def test_invalid_session():
    response = client.post(
        "/api/chat",
        json={
            "session_id": "nonexistent-session",
            "message": "test message"
        }
    )
    assert response.status_code == 404

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_gemini_error_handling(monkeypatch):
    async def mock_error_response(self, prompt: str) -> str:
        raise Exception("Gemini API error")
    
    monkeypatch.setattr(
        LLMService,
        "_generate_response",
        mock_error_response
    )

    # Create session
    session_response = client.post("/api/session")
    session_id = session_response.json()["id"]

    # Send chat message
    chat_response = client.post(
        "/api/chat",
        json={
            "session_id": session_id,
            "message": "Test error handling"
        }
    )
    
    assert chat_response.status_code == 200
    data = chat_response.json()
    assert "trouble" in data["content"].lower()
    assert data["confidence"] == 0.0