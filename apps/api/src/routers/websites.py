from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

class WebsiteCreateDTO(BaseModel):
    logo_url: Optional[str] = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
    name: str
    domain: str
    workflow_name: str
    cms_type: str
    cms_credentials: Dict[str, Any]

class WebsiteUpdateDTO(BaseModel):
    logo_url: Optional[str] = None
    name: Optional[str] = None
    domain: Optional[str] = None
    status: Optional[str] = None
    workflow_name: Optional[str] = None
    cms_type: Optional[str] = None
    cms_credentials: Optional[Dict[str, Any]] = None

MOCK_WEBSITES = [
    {
        "id": "site-1",
        "logo_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
        "name": "TechPulse Daily",
        "domain": "techpulsedaily.com",
        "status": "active",
        "workflow_name": "13-Agent Autonomous Newsroom",
        "cms_type": "WordPress",
        "cms_credentials": {"url": "https://techpulsedaily.com/wp-json", "username": "admin"},
        "total_posts": 284,
        "total_visitors": "45.2K",
        "monthly_pageviews": "128,400",
        "avg_ctr": "4.8%",
        "created_at": "2026-07-28"
    },
    {
        "id": "site-2",
        "logo_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
        "name": "AI Growth Insights",
        "domain": "aigrowthinsights.io",
        "status": "active",
        "workflow_name": "fal.ai Image & Content Workflow",
        "cms_type": "Webflow",
        "cms_credentials": {"api_token": "wf_token_98765", "collection_id": "col_123"},
        "total_posts": 142,
        "total_visitors": "28.9K",
        "monthly_pageviews": "74,100",
        "avg_ctr": "5.2%",
        "created_at": "2026-07-28"
    },
    {
        "id": "site-3",
        "logo_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
        "name": "SaaS Commerce Weekly",
        "domain": "saascommerce.store",
        "status": "stopped",
        "workflow_name": "Multi-Lingual Translation Workflow",
        "cms_type": "Shopify",
        "cms_credentials": {"store_domain": "saascommerce.myshopify.com", "access_token": "shpat_abc123"},
        "total_posts": 68,
        "total_visitors": "12.4K",
        "monthly_pageviews": "31,800",
        "avg_ctr": "3.9%",
        "created_at": "2026-07-28"
    }
]

@router.get("/")
def get_websites():
    return MOCK_WEBSITES

@router.get("/{site_id}")
def get_website(site_id: str):
    for site in MOCK_WEBSITES:
        if site["id"] == site_id:
            return site
    raise HTTPException(status_code=404, detail="Website not found")

@router.post("/")
def create_website(payload: WebsiteCreateDTO):
    new_site = {
        "id": f"site-{uuid.uuid4().hex[:6]}",
        "logo_url": payload.logo_url or "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
        "name": payload.name,
        "domain": payload.domain,
        "status": "active",
        "workflow_name": payload.workflow_name,
        "cms_type": payload.cms_type,
        "cms_credentials": payload.cms_credentials,
        "total_posts": 0,
        "total_visitors": "0K",
        "monthly_pageviews": "0",
        "avg_ctr": "0%",
        "created_at": datetime.utcnow().strftime("%Y-%m-%d")
    }
    MOCK_WEBSITES.append(new_site)
    return new_site

@router.put("/{site_id}")
def update_website(site_id: str, payload: WebsiteUpdateDTO):
    for site in MOCK_WEBSITES:
        if site["id"] == site_id:
            if payload.logo_url: site["logo_url"] = payload.logo_url
            if payload.name: site["name"] = payload.name
            if payload.domain: site["domain"] = payload.domain
            if payload.status: site["status"] = payload.status
            if payload.workflow_name: site["workflow_name"] = payload.workflow_name
            if payload.cms_type: site["cms_type"] = payload.cms_type
            if payload.cms_credentials: site["cms_credentials"] = payload.cms_credentials
            return site
    raise HTTPException(status_code=404, detail="Website not found")

@router.patch("/{site_id}")
def toggle_website_status(site_id: str, payload: WebsiteUpdateDTO):
    for site in MOCK_WEBSITES:
        if site["id"] == site_id:
            if payload.status:
                site["status"] = payload.status
            return site
    raise HTTPException(status_code=404, detail="Website not found")

@router.delete("/{site_id}")
def delete_website(site_id: str):
    global MOCK_WEBSITES
    MOCK_WEBSITES = [s for s in MOCK_WEBSITES if s["id"] != site_id]
    return {"status": "deleted", "id": site_id}
