try:
    from sqlalchemy.ext.asyncio import AsyncSession
    from sqlalchemy.future import select
    from sqlalchemy import update, delete
except ImportError:
    AsyncSession = None
    select = None
    update = None
    delete = None

from typing import List, Optional, Dict, Any
import uuid

from src.models.entities import Organization, User, Website, Article, AgentExecutionLog, ApiKey, MediaAsset
from src.schemas.dto import WebsiteCreate, ArticleCreate

# Website CRUD
async def get_websites_db(db: Any) -> List[Any]:
    if not select or not db:
        return []
    result = await db.execute(select(Website))
    return result.scalars().all()

async def get_website_by_id_db(db: Any, site_id: uuid.UUID) -> Optional[Any]:
    if not select or not db:
        return None
    result = await db.execute(select(Website).where(Website.id == site_id))
    return result.scalar_one_or_none()

async def create_website_db(db: Any, payload: WebsiteCreate) -> Website:
    site = Website(
        id=uuid.uuid4(),
        organization_id=payload.organization_id,
        name=payload.name,
        domain=payload.domain,
        logo_url=payload.logo_url,
        theme=payload.theme,
        languages=payload.languages,
        timezone=payload.timezone,
        brand_voice=payload.brand_voice,
        publishing_schedule=payload.publishing_schedule,
        seo_settings=payload.seo_settings,
        affiliate_settings=payload.affiliate_settings,
        cms_credentials=payload.cms_credentials
    )
    if db:
        db.add(site)
        await db.commit()
        await db.refresh(site)
    return site

# Article CRUD
async def get_articles_db(db: Any, status: Optional[str] = None) -> List[Any]:
    if not select or not db:
        return []
    query = select(Article)
    if status:
        query = query.where(Article.status == status)
    result = await db.execute(query)
    return result.scalars().all()

async def create_article_db(db: Any, payload: ArticleCreate) -> Article:
    article = Article(
        id=uuid.uuid4(),
        website_id=payload.website_id,
        title=payload.title,
        slug=payload.slug,
        status=payload.status,
        content_html=payload.content_html,
        content_markdown=payload.content_markdown,
        seo_title=payload.seo_title,
        meta_description=payload.meta_description,
        primary_keyword=payload.primary_keyword,
        secondary_keywords=payload.secondary_keywords,
        seo_metadata=payload.seo_metadata,
        research_data=payload.research_data
    )
    if db:
        db.add(article)
        await db.commit()
        await db.refresh(article)
    return article

# Agent Execution Logs CRUD
async def get_agent_logs_db(db: Any) -> List[Any]:
    if not select or not db:
        return []
    result = await db.execute(select(AgentExecutionLog).order_by(AgentExecutionLog.created_at.desc()))
    return result.scalars().all()

async def log_agent_execution_db(
    db: Any,
    article_id: uuid.UUID,
    agent_name: str,
    status: str,
    tokens: int,
    cost: float,
    execution_time_ms: int,
    input_state: Dict = None,
    output_state: Dict = None
) -> AgentExecutionLog:
    log = AgentExecutionLog(
        id=uuid.uuid4(),
        article_id=article_id,
        agent_name=agent_name,
        status=status,
        tokens_used=tokens,
        cost=cost,
        execution_time_ms=execution_time_ms,
        input_state=input_state or {},
        output_state=output_state or {}
    )
    if db:
        db.add(log)
        await db.commit()
        await db.refresh(log)
    return log
