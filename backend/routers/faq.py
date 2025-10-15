from fastapi import APIRouter, Query
from services.faq_service import faq_service

router = APIRouter()

@router.get("/faq/search")
async def search_faq(q: str = Query(..., min_length=2)):
    answer, confidence = faq_service.search(q)
    return {
        "answer": answer or "No matching FAQ found.",
        "confidence": confidence
    }