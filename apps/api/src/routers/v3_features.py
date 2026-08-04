from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter()

@router.get("/plugins")
def get_plugins():
    return [
        {"id": "p-1", "name": "Grammarly Advanced Checker", "category": "SEO & Grammar", "status": "installed", "version": "2.4.1"},
        {"id": "p-2", "name": "Canva Thumbnail Sync", "category": "Media Assets", "status": "installed", "version": "1.8.0"},
        {"id": "p-3", "name": "Ghost CMS Publisher", "category": "CMS Connector", "status": "available", "version": "3.1.0"},
        {"id": "p-4", "name": "Webflow CMS Connector", "category": "CMS Connector", "status": "available", "version": "1.5.2"}
    ]

@router.get("/mcp")
def get_mcp_marketplace():
    return [
        {"id": "mcp-1", "name": "Freepik MCP Server", "description": "AI image generation via Freepik MCP protocol", "status": "active"},
        {"id": "mcp-2", "name": "Google News MCP Server", "description": "Real-time news stream scraper", "status": "active"},
        {"id": "mcp-3", "name": "GitHub Releases MCP Server", "description": "Software update and changelog extraction", "status": "active"}
    ]

@router.get("/custom-agents")
def get_custom_agents():
    return [
        {"id": "ca-1", "name": "Affiliate Link Optimizer Agent", "role": "Auto-inserts Amazon & Impact links in relevant paragraphs", "status": "active"},
        {"id": "ca-2", "name": "Legal & Compliance Agent", "role": "Scans articles for GDPR compliance and disclosure footers", "status": "active"}
    ]

@router.get("/billing")
def get_billing_info():
    return {
        "current_plan": "Enterprise White Label",
        "monthly_quota": "Unlimited Articles",
        "billing_period": "Monthly",
        "next_invoice": "2026-08-01",
        "amount": "$499.00",
        "seats_used": "14 / 50 Users"
    }

@router.get("/webhooks")
def get_webhooks():
    return [
        {"id": "wh-1", "url": "https://api.mybrand.com/webhooks/article-published", "events": ["article.published"], "status": "active"},
        {"id": "wh-2", "url": "https://api.mybrand.com/webhooks/agent-failed", "events": ["agent.failed"], "status": "active"}
    ]
