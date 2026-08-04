from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

class IntegrationCreate(BaseModel):
    name: str
    category: str
    provider: str
    credentials: Dict[str, Any]

class IntegrationUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    credentials: Optional[Dict[str, Any]] = None

MOCK_INTEGRATIONS = [
    {
        "id": "int-1",
        "name": "fal.ai Flux & Image Generation",
        "category": "Image Generation",
        "provider": "fal_ai",
        "status": "active",
        "masked_key": "fal-key-••••••••••••78aF",
        "created_at": "2026-07-28"
    },
    {
        "id": "int-2",
        "name": "OpenAI GPT-4o LLM Engine",
        "category": "AI Models",
        "provider": "openai",
        "status": "active",
        "masked_key": "sk-proj-••••••••••••38fA",
        "created_at": "2026-07-28"
    },
    {
        "id": "int-3",
        "name": "Freepik MCP Protocol Tool",
        "category": "MCP Protocol",
        "provider": "freepik",
        "status": "active",
        "masked_key": "fpsk-••••••••••••210q",
        "created_at": "2026-07-28"
    },
    {
        "id": "int-4",
        "name": "WordPress REST API Connector",
        "category": "CMS Connectors",
        "provider": "wordpress",
        "status": "active",
        "masked_key": "wp-app-••••••••••••881a",
        "created_at": "2026-07-28"
    },
    {
        "id": "int-5",
        "name": "Google News MCP Scraper",
        "category": "Scrapers",
        "provider": "google_news",
        "status": "stopped",
        "masked_key": "gnews-••••••••••••1092",
        "created_at": "2026-07-28"
    }
]

@router.get("/")
def get_integrations():
    return MOCK_INTEGRATIONS

@router.post("/")
def create_integration(payload: IntegrationCreate):
    key = str(payload.credentials.get("key") or payload.credentials.get("api_key") or "secret")
    masked = key[:6] + "••••••••••••" + key[-4:] if len(key) > 10 else "••••••••"
    entry = {
        "id": f"int-{uuid.uuid4().hex[:6]}",
        "name": payload.name,
        "category": payload.category,
        "provider": payload.provider,
        "status": "active",
        "masked_key": masked,
        "created_at": datetime.utcnow().strftime("%Y-%m-%d")
    }
    MOCK_INTEGRATIONS.append(entry)
    return entry

@router.put("/{integration_id}")
def update_integration(integration_id: str, payload: IntegrationUpdate):
    for item in MOCK_INTEGRATIONS:
        if item["id"] == integration_id:
            if payload.name:
                item["name"] = payload.name
            if payload.status:
                item["status"] = payload.status
            if payload.credentials and "key" in payload.credentials:
                key = str(payload.credentials["key"])
                item["masked_key"] = key[:6] + "••••••••••••" + key[-4:] if len(key) > 10 else "••••••••"
            return item
    raise HTTPException(status_code=404, detail="Integration not found")

@router.patch("/{integration_id}")
def toggle_integration_status(integration_id: str, payload: IntegrationUpdate):
    for item in MOCK_INTEGRATIONS:
        if item["id"] == integration_id:
            if payload.status:
                item["status"] = payload.status
            return item
    raise HTTPException(status_code=404, detail="Integration not found")

@router.delete("/{integration_id}")
def delete_integration(integration_id: str):
    global MOCK_INTEGRATIONS
    MOCK_INTEGRATIONS = [i for i in MOCK_INTEGRATIONS if i["id"] != integration_id]
    return {"status": "deleted", "id": integration_id}
