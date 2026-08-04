from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# Website DTOs
class WebsiteBase(BaseModel):
    name: str
    domain: str
    logo_url: Optional[str] = None
    theme: Optional[str] = "default"
    languages: Optional[List[str]] = ["en"]
    timezone: Optional[str] = "UTC"
    brand_voice: Optional[Dict[str, Any]] = {}
    publishing_schedule: Optional[Dict[str, Any]] = {}
    seo_settings: Optional[Dict[str, Any]] = {}
    affiliate_settings: Optional[Dict[str, Any]] = {}
    cms_credentials: Optional[Dict[str, Any]] = {}

class WebsiteCreate(WebsiteBase):
    organization_id: UUID

class WebsiteResponse(WebsiteBase):
    id: UUID
    organization_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# Article DTOs
class ArticleBase(BaseModel):
    title: str
    slug: str
    status: str = "draft"
    content_html: Optional[str] = None
    content_markdown: Optional[str] = None
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    primary_keyword: Optional[str] = None
    secondary_keywords: Optional[List[str]] = []
    seo_metadata: Optional[Dict[str, Any]] = {}
    research_data: Optional[Dict[str, Any]] = {}

class ArticleCreate(ArticleBase):
    website_id: UUID

class ArticleResponse(ArticleBase):
    id: UUID
    website_id: UUID
    total_ai_cost: float
    tokens_used: int
    published_at: Optional[datetime] = None
    wordpress_post_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Agent Workflow Trigger DTO
class AgentWorkflowTrigger(BaseModel):
    website_id: UUID
    topic: str
    target_keywords: Optional[List[str]] = []
    auto_publish: bool = False


# Analytics Summary DTO
class AnalyticsSummary(BaseModel):
    total_websites: int
    total_articles: int
    published_articles: int
    total_ai_cost: float
    total_tokens: int
    estimated_traffic: int
    top_performing_keywords: List[str]
