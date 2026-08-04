import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON, Numeric, Integer, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from src.db.session import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    plan = Column(String, default="enterprise")
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    websites = relationship("Website", back_populates="organization", cascade="all, delete-orphan")
    api_keys = relationship("ApiKey", back_populates="organization", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="admin") # admin, editor, viewer
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")


class Website(Base):
    __tablename__ = "websites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    theme = Column(String, default="default")
    languages = Column(JSONB, default=["en"])
    timezone = Column(String, default="UTC")
    brand_voice = Column(JSONB, default={})
    publishing_schedule = Column(JSONB, default={})
    seo_settings = Column(JSONB, default={})
    affiliate_settings = Column(JSONB, default={})
    cms_credentials = Column(JSONB, default={})  # WordPress REST API URL, Username, Application Password
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="websites")
    articles = relationship("Article", back_populates="website", cascade="all, delete-orphan")


class Article(Base):
    __tablename__ = "articles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.id"), nullable=False)
    title = Column(String, nullable=False)
    slug = Column(String, nullable=False, index=True)
    status = Column(String, default="draft")  # draft, scheduled, published, refreshing
    content_html = Column(Text, nullable=True)
    content_markdown = Column(Text, nullable=True)
    seo_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    primary_keyword = Column(String, nullable=True)
    secondary_keywords = Column(JSONB, default=[])
    seo_metadata = Column(JSONB, default={})
    research_data = Column(JSONB, default={})
    total_ai_cost = Column(Numeric(10, 4), default=0.0000)
    tokens_used = Column(Integer, default=0)
    published_at = Column(DateTime, nullable=True)
    wordpress_post_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    website = relationship("Website", back_populates="articles")
    logs = relationship("AgentExecutionLog", back_populates="article", cascade="all, delete-orphan")
    media = relationship("MediaAsset", back_populates="article", cascade="all, delete-orphan")


class AgentExecutionLog(Base):
    __tablename__ = "agent_execution_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    article_id = Column(UUID(as_uuid=True), ForeignKey("articles.id"), nullable=False)
    agent_name = Column(String, nullable=False)
    status = Column(String, default="success")  # success, failed, retrying
    input_state = Column(JSONB, default={})
    output_state = Column(JSONB, default={})
    tokens_used = Column(Integer, default=0)
    cost = Column(Numeric(10, 4), default=0.0000)
    execution_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    article = relationship("Article", back_populates="logs")


class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    provider = Column(String, nullable=False)  # openai, claude, gemini, freepik, wordpress
    name = Column(String, nullable=False)
    encrypted_key = Column(String, nullable=False)
    is_active = Column(String, default="true")
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="api_keys")


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    article_id = Column(UUID(as_uuid=True), ForeignKey("articles.id"), nullable=True)
    asset_type = Column(String, nullable=False)  # featured_image, social_banner, infographic, thumbnail
    url = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    caption = Column(String, nullable=True)
    provider = Column(String, default="freepik")
    created_at = Column(DateTime, default=datetime.utcnow)

    article = relationship("Article", back_populates="media")
