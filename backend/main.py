from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

from models.db import create_db_and_tables
from routers import chat, session, faq, escalate

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application startup...")
    create_db_and_tables()
    yield
    print("Application shutdown.")

app = FastAPI(
    title="Unthinkable Solution AI Support Bot API",
    version="1.0.0",
    description="Backend API for the Unthinkable Solution AI Customer Support Bot.",
    lifespan=lifespan,
)

# CORS configuration
origins = [
    "http://localhost:5173",  # Frontend development server
    "http://localhost:5174",  # Frontend development server (if 5173 is in use)
    "http://localhost:5175",  # Frontend development server (if 5174 is in use)
    "http://localhost:5176",  # Frontend development server (if 5175 is in use)
    "http://10.208.169.111:5173",  # Network access
    # Add other frontend origins as needed for production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    return RedirectResponse(url="/docs")

@app.get("/api/health", summary="Health Check", response_model=dict)
async def health_check():
    return {"status": "healthy", "message": "API is running smoothly!"}

# Include routers
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(session.router, prefix="/api", tags=["Session"])
app.include_router(faq.router, prefix="/api", tags=["FAQ"])
app.include_router(escalate.router, prefix="/api", tags=["Escalate"])