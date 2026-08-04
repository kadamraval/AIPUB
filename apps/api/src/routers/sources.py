from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

class SourceCreate(BaseModel):
    name: str
    source_type: str  # RSS Feed, Google News Stream, Reddit Subreddit, GitHub Releases, Custom Web Scraper
    url: str
    target_site: str
    fetch_interval: str  # Every 1 Hour, Every 6 Hours, Daily

MOCK_SOURCES = [
    {
        "id": "src-1",
        "name": "TechCrunch AI Feed",
        "source_type": "RSS Feed",
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
        "target_site": "TechPulse Daily",
        "status": "active",
        "last_fetched": "10 mins ago",
        "total_fetched_items": 142
    },
    {
        "id": "src-2",
        "name": "Google News AI Stream",
        "source_type": "Google News Stream",
        "url": "https://news.google.com/rss/search?q=Autonomous+AI+Agents",
        "target_site": "AI Growth Insights",
        "status": "active",
        "last_fetched": "1 hour ago",
        "total_fetched_items": 98
    },
    {
        "id": "src-3",
        "name": "LangChain GitHub Releases",
        "source_type": "GitHub Releases",
        "url": "https://github.com/langchain-ai/langgraph/releases",
        "target_site": "TechPulse Daily",
        "status": "active",
        "last_fetched": "3 hours ago",
        "total_fetched_items": 45
    }
]

@router.get("/")
def get_sources():
    return MOCK_SOURCES

@router.post("/")
def create_source(payload: SourceCreate):
    entry = {
        "id": f"src-{uuid.uuid4().hex[:6]}",
        "name": payload.name,
        "source_type": payload.source_type,
        "url": payload.url,
        "target_site": payload.target_site,
        "status": "active",
        "last_fetched": "Just Now",
        "total_fetched_items": 0
    }
    MOCK_SOURCES.append(entry)
    return entry

@router.post("/{source_id}/fetch")
def trigger_fetch_source(source_id: str):
    for s in MOCK_SOURCES:
        if s["id"] == source_id:
            s["last_fetched"] = "Just Now"
            s["total_fetched_items"] += 5
            return {"status": "success", "message": f"Fetched 5 new items from source '{s['name']}'", "source": s}
    raise HTTPException(status_code=404, detail="Source not found")

@router.delete("/{source_id}")
def delete_source(source_id: str):
    global MOCK_SOURCES
    MOCK_SOURCES = [s for s in MOCK_SOURCES if s["id"] != source_id]
    return {"status": "deleted", "id": source_id}
