# 🚀 AI Publishing OS

> **The Next-Generation Autonomous Multi-Tenant AI Content & Publishing Ecosystem**  
> Streamline research, keyword intelligence, multi-agent AI article creation, asset generation, and automated multi-CMS publishing with enterprise-grade precision.

---

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![HeroUI](https://img.shields.io/badge/HeroUI-v3.0.0-purple?style=for-the-badge)](https://heroui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-13--Agent-orange?style=for-the-badge)](https://www.langchain.com/langgraph)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ed?style=for-the-badge&logo=docker)](https://www.docker.com/)

---

## 🎯 Executive Overview

**AI Publishing OS** is an enterprise-grade autonomous content publishing platform engineered for digital publishers, media networks, affiliate marketers, and digital marketing agencies. It manages unlimited target websites and turns raw input feeds (RSS, Google News, API endpoints, web scrapers) into fully researched, SEO-optimized, media-rich articles published directly to **WordPress, Ghost, Webflow, Shopify, and Strapi**.

Powered by a **13-Agent LangGraph StateGraph engine**, AI Publishing OS handles every step of the content lifecycle automatically—from trend discovery and keyword intent clustering to factual verification, fal.ai image synthesis, JSON-LD schema generation, and post-publishing rank tracking.

---

## 🏗️ System Architecture

```
                                  ┌─────────────────────────────┐
                                  │      Admin Web Portal       │
                                  │   Next.js 15 + HeroUI v3    │
                                  └──────────────┬──────────────┘
                                                 │ REST / WebSocket
                                  ┌──────────────▼──────────────┐
                                  │       Backend Core API      │
                                  │   FastAPI / PostgreSQL 15   │
                                  └──────────────┬──────────────┘
                                                 │ Async Task Queues
                                  ┌──────────────▼──────────────┐
                                  │     LangGraph Engine        │
                                  │    13-Agent AI Pipeline     │
                                  └──────────────┬──────────────┘
                                                 │
            ┌───────────────────┬────────────────┼───────────────────┬───────────────────┐
            ▼                   ▼                ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐  ┌───────────┐   ┌───────────────────┐  ┌──────────────────┐
    │ Data Intake   │   │ LLM Providers │  │ fal.ai &  │   │ Cloudflare R2 /   │  │   CMS Targets    │
    │ (RSS, News)   │   │ (GPT4/Claude) │  │  Freepik  │   │   AWS S3 Bucket   │  │(WordPress/Ghost) │
    └───────────────┘   └───────────────┘  └───────────┘   └───────────────────┘  └──────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend Application (`apps/web`)
* **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, React 19, TypeScript)
* **UI Design System**: [HeroUI v3](https://heroui.com/) (`@heroui/react` & `@heroui/styles`)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@import "tailwindcss"; @import "@heroui/styles";`)
* **Icons**: [Lucide React](https://lucide.react.dev/) (`lucide-react`)
* **Collection Primitives**: React Aria Component Compound Patterns (`<Table>`, `<TableContent>`, `<Select>`, `<ListBox>`, `<Avatar>`, `<Dropdown>`, `<Accordion>`)

### Backend Core API (`apps/api`)
* **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
* **Database**: PostgreSQL 15 (SQLAlchemy 2.0 Async, Alembic Migrations)
* **Caching & Queues**: Redis 7 (BullMQ & Celery Async Queues)
* **Authentication**: OAuth2 with JWT Tokens & Scoped Role Permissions

### Autonomous Agent Microservice (`apps/agent-engine`)
* **State Engine**: [LangGraph](https://www.langchain.com/langgraph) 13-Agent StateGraph
* **LLM Engine Integration**: OpenAI (GPT-4o, GPT-4o-mini), Anthropic (Claude 3.5 Sonnet), Google Gemini (1.5 Pro/Flash), Groq (Llama 3.3 70B)
* **Image Synthesis**: fal.ai (FLUX.1 Dev) & Freepik MCP Integration
* **Web Scrapers**: Tavily AI Search, Firecrawl, BeautifulSoup4, Feedparser

---

## 🔌 Ecosystem Integrations & Providers

### 📰 CMS Publishing Targets
* **WordPress**: Direct REST API integration with Application Password security, supporting Draft, Schedule, and Direct Publishing with categories and tags.
* **Ghost**: Ghost Admin API v5 integration for seamless newsletter & publication dispatch.
* **Webflow**: Webflow CMS Collections REST API with custom field mapping.
* **Shopify**: Shopify Store Blog API publishing for eCommerce content strategy.
* **Strapi**: Headless CMS REST endpoint integration.

### 🧠 AI Models & Multimodal Engines
* **OpenAI**: GPT-4o, GPT-4o-mini, o3-mini for copy generation & DALL-E 3 artwork.
* **Anthropic**: Claude 3.5 Sonnet & Claude 3.5 Haiku for deep analysis and copy editing.
* **Google Gemini**: Gemini 1.5 Pro & Gemini 1.5 Flash for vision analysis and multimodal research.
* **Groq**: Llama 3.3 70B & Mixtral for ultra-fast, cost-effective inference.
* **fal.ai & Freepik**: High-resolution FLUX.1 Dev artwork generation & Model Context Protocol (MCP) asset sourcing.

### 📡 Data Intake & Scraping Streams
* **RSS & Atom Feeds**: Automated scheduled intake polling.
* **Google News & SERP**: Keyword-triggered trend and news intake.
* **Custom Web & DOM Scrapers**: Custom CSS selector extraction rules for title, body, and metadata parsing.

### 🔔 Infrastructure & Messaging
* **Storage**: Cloudflare R2 Buckets & AWS S3 for hosting featured media assets.
* **Notifications**: Slack Incoming Webhooks & Resend Email API for real-time workflow failure alerts.

---

## 💻 Application Pages & Admin Portal Routes

| Route Path | Page Title | Description & Capabilities |
| :--- | :--- | :--- |
| `/admin/dashboard` | **Admin Dashboard** | Real-time platform KPI overview featuring 5-column metric grid (Total Articles, Published Count, In Review, Revenue, Net Profit), recent activity feed, and property quick stats. |
| `/admin/websites` | **Websites Directory** | Property management matrix showing connected websites, target CMS badges, active status toggles, and direct creation buttons. |
| `/admin/websites/new` | **Connect Website** | HeroUI Accordion form featuring white cards and soft grey input fields for general settings, CMS connection keys, publishing policy quotas, and workflow blueprints. |
| `/admin/websites/[id]` | **Website Config** | Individual property customization for brand voice guidelines, locale settings, and category mapping. |
| `/admin/sources` | **Source Streams** | Intake feed catalog with type filters (RSS, Web, Sitemap, API, File, Manual), polling intervals, and manual fetch triggers. |
| `/admin/sources/new` | **Add Source Stream** | HeroUI Accordion setup for source identity, intake format, DOM CSS selectors, authorization headers, and keyword inclusion/exclusion rules. |
| `/admin/custom-agents` | **Custom AI Agents** | Directory of autonomous AI agents (SEO Copywriter, Fact Checker, Technical Scraper) displaying tool permission badges, status switches, and model tags. |
| `/admin/custom-agents/new`| **Create AI Agent** | Form wizard for defining agent identity, persona emoji, LLM provider & version, system prompt instructions, temperature, max tokens, and enabled tool permissions. |
| `/admin/workflows` | **Workflows Canvas** | Interactive visual node graph canvas & blueprint catalog with step sequence editor, node palette, simulation execution, and CSV export. |
| `/admin/articles` | **Article Library** | Complete repository of generated content with status filters (Published, Draft, Scheduled, In Review), word count, SEO scores, and manual CMS sync triggers. |
| `/admin/keywords` | **Keyword Intelligence** | Keyword research matrix, search volume metrics, SEO difficulty scores, intent clustering (Transactional, Informational, Commercial), and FAQ auto-generator. |
| `/admin/media` | **Media Asset Library** | Visual gallery of fal.ai & Freepik generated featured images, alt text metadata, aspect ratio tags, and direct storage URLs. |
| `/admin/integrations` | **Integrations Vault** | Credentials marketplace & API key vault for WordPress, Ghost, OpenAI, Anthropic, fal.ai, Resend Email, and Slack webhooks. |
| `/admin/analytics` | **Analytics & Velocity** | Interactive traffic velocity charts, impressions, CTR, organic rank positions, and net profit calculations across properties. |
| `/admin/newsletters` | **Email Newsletters** | Automated email campaign builder, subscriber list management, and newsletter dispatch schedules. |
| `/admin/settings` | **Platform Settings** | HeroUI Accordion form for profile identity, app preferences, default AI engines, API key vault, web search scrapers, database URIs (PostgreSQL/Redis), worker concurrency, 2FA security, and Slack alerts. |
| `/login` & `/signup` | **Auth Portal** | Secure organization onboarding and authentication. |

---

## ⚡ Installation & Quick Start

### Prerequisites
* **Node.js**: >= 18.18.0
* **Python**: >= 3.11
* **Docker Desktop**: Installed and running (for PostgreSQL & Redis)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/ai-publishing-os.git
cd ai-publishing-os
```

---

### Step 2: Spin Up Infrastructure (PostgreSQL & Redis)
```bash
docker compose up -d
```
* **PostgreSQL**: Port `5433` (Database: `aipub_db`, User: `aipub`, Pass: `aipub_secret`)
* **Redis**: Port `6380`

---

### Step 3: Start Frontend Application (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

### Step 4: Start Backend Core API (`apps/api`)
```bash
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation will be live at **`http://localhost:8000/docs`**.

---

### Step 5: Start Autonomous Agent Engine (`apps/agent-engine`)
```bash
cd apps/agent-engine
pip install -r requirements.txt
python main.py
```

---

### Step 6: Verify Production Build
```bash
cd apps/web
npm run build
```

---

## 📁 Repository Structure

```
ai-publishing-os/
├── .agents/                         # Custom Agent Skills & MCP Server Config
│   └── skills/
│       ├── heroui-react/            # HeroUI v3 React Skill & Docs Index
│       └── heroui-migration/        # HeroUI v2 to v3 Migration Guide
├── AGENTS.md                        # AI Agent Coding Guidelines & HeroUI v3 Standards
├── docker-compose.yml               # Docker Compose file (PostgreSQL 15 & Redis 7)
├── README.md                        # Complete Ecosystem Documentation
└── apps/
    ├── web/                         # Next.js 15 Frontend Application
    │   ├── src/
    │   │   ├── app/                 # App Router Pages & Layouts
    │   │   │   ├── admin/           # Admin Dashboard Portal Routes
    │   │   │   │   ├── dashboard/
    │   │   │   │   ├── websites/
    │   │   │   │   ├── sources/
    │   │   │   │   ├── custom-agents/
    │   │   │   │   ├── workflows/
    │   │   │   │   ├── articles/
    │   │   │   │   ├── keywords/
    │   │   │   │   ├── media/
    │   │   │   │   ├── integrations/
    │   │   │   │   ├── analytics/
    │   │   │   │   ├── newsletters/
    │   │   │   │   └── settings/
    │   │   │   ├── layout.tsx
    │   │   │   └── globals.css     # Tailwind v4 + HeroUI v3 Styles
    │   │   ├── components/          # Reusable HeroUI UI Components
    │   │   │   ├── layout/          # Header & Sidebar Navigation
    │   │   │   └── shared/          # Toolbar, DataCard, ClientOnly, StatusBadge
    │   │   └── lib/                 # API Client Functions & Utilities
    │   └── package.json
    │
    ├── api/                         # FastAPI Core API Microservice
    │   ├── src/
    │   │   ├── routers/             # Endpoint Routers (Websites, Agents, Workflows)
    │   │   ├── models/              # SQLAlchemy Database Entities
    │   │   └── core/                # Config, Security, and Database Setup
    │   └── main.py
    │
    └── agent-engine/                # Python + LangGraph Microservice
        ├── agents/                  # 13-Agent LangGraph Pipeline Implementation
        ├── tools/                   # WordPress, fal.ai, RSS & Scraper Tools
        └── pipeline.py              # StateGraph Pipeline Orchestrator
```

---

## 📜 License & Compliance

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>AI Publishing OS</b> — Enterprise Content Automation Engine
</p>
