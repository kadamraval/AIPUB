from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

class ApiKeyCreate(BaseModel):
    provider: str  # fal_ai, openai, claude, gemini, freepik, wordpress
    name: str
    key: str

class ApiKeyResponse(BaseModel):
    id: str
    provider: str
    name: str
    key_masked: str
    status: str
    created_at: str

MOCK_API_KEYS = [
    {
        "id": "k-1",
        "provider": "fal_ai",
        "name": "fal.ai Flux & Image Key",
        "key_masked": "fal-key-••••••••••••••••78aF",
        "status": "active",
        "created_at": "2026-07-28"
    },
    {
        "id": "k-2",
        "provider": "openai",
        "name": "OpenAI GPT-4o Key",
        "key_masked": "sk-proj-••••••••••••••••38fA",
        "status": "active",
        "created_at": "2026-07-28"
    },
    {
        "id": "k-3",
        "provider": "freepik",
        "name": "Freepik MCP Key",
        "key_masked": "fpsk-••••••••••••••••210q",
        "status": "active",
        "created_at": "2026-07-28"
    }
]

@router.get("/", response_model=List[ApiKeyResponse])
def get_api_keys():
    return MOCK_API_KEYS

@router.post("/", response_model=ApiKeyResponse)
def create_api_key(payload: ApiKeyCreate):
    masked = payload.key[:6] + "••••••••••••••••" + payload.key[-4:] if len(payload.key) > 10 else "••••••••"
    new_entry = {
        "id": str(uuid.uuid4()),
        "provider": payload.provider,
        "name": payload.name,
        "key_masked": masked,
        "status": "active",
        "created_at": datetime.utcnow().strftime("%Y-%m-%d")
    }
    MOCK_API_KEYS.append(new_entry)
    return new_entry
