from fastapi import APIRouter
from src.schemas.dto import AgentWorkflowTrigger, AnalyticsSummary

router = APIRouter()

@router.post("/trigger")
def trigger_agent_workflow(payload: AgentWorkflowTrigger):
    return {
        "status": "initiated",
        "job_id": "job_987654321_langgraph",
        "message": f"Autonomous 13-Agent workflow launched for topic: '{payload.topic}'",
        "target_site_id": str(payload.website_id)
    }

@router.get("/logs")
def get_agent_logs():
    return [
        {
            "id": "log-001",
            "agent_name": "SupervisorAgent",
            "status": "success",
            "execution_time_ms": 120,
            "tokens_used": 450,
            "cost": 0.0012,
            "created_at": "2026-07-28T12:01:00Z"
        },
        {
            "id": "log-002",
            "agent_name": "ResearchAgent",
            "status": "success",
            "execution_time_ms": 1450,
            "tokens_used": 3200,
            "cost": 0.0096,
            "created_at": "2026-07-28T12:01:02Z"
        },
        {
            "id": "log-003",
            "agent_name": "KeywordAgent",
            "status": "success",
            "execution_time_ms": 820,
            "tokens_used": 1800,
            "cost": 0.0054,
            "created_at": "2026-07-28T12:01:04Z"
        },
        {
            "id": "log-004",
            "agent_name": "WritingAgent",
            "status": "success",
            "execution_time_ms": 4200,
            "tokens_used": 8500,
            "cost": 0.0255,
            "created_at": "2026-07-28T12:01:08Z"
        },
        {
            "id": "log-005",
            "agent_name": "SEOAgent",
            "status": "success",
            "execution_time_ms": 610,
            "tokens_used": 1200,
            "cost": 0.0036,
            "created_at": "2026-07-28T12:01:10Z"
        },
        {
            "id": "log-006",
            "agent_name": "PublisherAgent",
            "status": "success",
            "execution_time_ms": 1100,
            "tokens_used": 200,
            "cost": 0.0006,
            "created_at": "2026-07-28T12:01:12Z"
        }
    ]

@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary():
    return {
        "total_websites": 12,
        "total_articles": 348,
        "published_articles": 294,
        "total_ai_cost": 14.8520,
        "total_tokens": 4950000,
        "estimated_traffic": 184500,
        "top_performing_keywords": [
            "autonomous ai agents",
            "langgraph multi agent workflows",
            "programmatic seo 2026",
            "freepik mcp image generation",
            "wordpress REST publishing automation"
        ]
    }
