from fastapi import APIRouter, HTTPException
from typing import List, Optional
from uuid import UUID
from src.schemas.dto import ArticleResponse, ArticleCreate

router = APIRouter()

MOCK_ARTICLES = [
    {
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "website_id": "11111111-1111-1111-1111-111111111111",
        "title": "The Future of Autonomous AI Agents in Enterprise Software",
        "slug": "future-autonomous-ai-agents-enterprise-software",
        "status": "published",
        "content_html": "<h1>The Future of Autonomous AI Agents in Enterprise Software</h1><p>Autonomous AI agents are transforming enterprise operations...</p>",
        "content_markdown": "# The Future of Autonomous AI Agents in Enterprise Software\n\nAutonomous AI agents are transforming enterprise operations...",
        "seo_title": "Future of Autonomous AI Agents in Enterprise | TechPulse",
        "meta_description": "Explore how autonomous AI agents, multi-agent frameworks, and LLMs are revolutionizing enterprise publishing and workflow automation.",
        "primary_keyword": "autonomous ai agents",
        "secondary_keywords": ["agentic workflows", "enterprise ai software", "langgraph automation"],
        "seo_metadata": {"score": 94, "readability": "Good", "word_count": 1850},
        "research_data": {"sources_count": 8, "top_facts": 12},
        "total_ai_cost": 0.0425,
        "tokens_used": 14200,
        "published_at": "2026-07-28T10:00:00Z",
        "wordpress_post_id": 4092,
        "created_at": "2026-07-28T09:00:00Z"
    },
    {
        "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "website_id": "22222222-2222-2222-2222-222222222222",
        "title": "Top 10 High-Volume SEO Strategies for 2026 Publishing",
        "slug": "top-10-seo-strategies-2026-publishing",
        "status": "scheduled",
        "content_html": "<h1>Top 10 High-Volume SEO Strategies for 2026 Publishing</h1><p>Search engine optimization has evolved rapidly...</p>",
        "content_markdown": "# Top 10 High-Volume SEO Strategies for 2026 Publishing\n\nSearch engine optimization has evolved rapidly...",
        "seo_title": "Top 10 High-Volume SEO Strategies for 2026",
        "meta_description": "Master programmatic SEO, AI content clusters, and structured schema markup for 2026 search dominance.",
        "primary_keyword": "seo strategies 2026",
        "secondary_keywords": ["programmatic seo", "schema markup", "content clusters"],
        "seo_metadata": {"score": 91, "readability": "Excellent", "word_count": 2200},
        "research_data": {"sources_count": 11, "top_facts": 15},
        "total_ai_cost": 0.0510,
        "tokens_used": 16800,
        "published_at": None,
        "wordpress_post_id": None,
        "created_at": "2026-07-28T11:15:00Z"
    }
]

@router.get("/", response_model=List[ArticleResponse])
def get_articles(status: Optional[str] = None):
    if status:
        return [a for a in MOCK_ARTICLES if a["status"] == status]
    return MOCK_ARTICLES

@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: UUID):
    for article in MOCK_ARTICLES:
        if article["id"] == str(article_id):
            return article
    raise HTTPException(status_code=404, detail="Article not found")
