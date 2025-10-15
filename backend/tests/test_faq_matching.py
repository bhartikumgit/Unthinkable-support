import pytest
from services.faq_service import FAQService

@pytest.fixture
def faq_service():
    return FAQService()

def test_exact_match(faq_service):
    query = "How do I track my order?"
    answer, confidence = faq_service.search(query)
    assert confidence == 1.0
    assert "track your order" in answer.lower()

def test_fuzzy_match(faq_service):
    query = "where can I see my order status"
    answer, confidence = faq_service.search(query)
    assert confidence > 0.7
    assert "order status" in answer.lower()

def test_low_confidence_match(faq_service):
    query = "what is the meaning of life?"
    answer, confidence = faq_service.search(query)
    assert confidence < 0.5

def test_case_insensitive_match(faq_service):
    query = "HOW DO I TRACK MY ORDER?"
    answer, confidence = faq_service.search(query)
    assert confidence == 1.0
    assert "track your order" in answer.lower()

def test_word_order_variation(faq_service):
    query = "my order, how do I track it?"
    answer, confidence = faq_service.search(query)
    assert confidence > 0.8
    assert "track your order" in answer.lower()

def test_threshold_respect(faq_service):
    # This should match the "Track Order" FAQ but with low confidence
    query = "package location tracking system status update where"
    answer, confidence = faq_service.search(query)
    assert confidence < 0.8  # Should be below typical threshold
